import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message, TWCCUser, Role
from .serializers import MessageSerializer

class ChatConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for handling real-time chat messages.

    This consumer manages connections to a global chat room, receives messages from clients,
    persists them to the database with visibility controls, and broadcasts the serialized messages
    to all connected clients in the room.

    WebSocket Message Format (incoming):
    {
        "user_id": <int>,             # ID of the sending user
        "content": <string>,          # Message content
        "visibility": <string>,       # One of: "ALL" (default), "ROLES", "GROUP"
        "visible_roles": [<int>],     # Optional: list of role IDs (used if visibility == "ROLES")
        "visible_users": [<int>]      # Optional: list of user IDs (used if visibility == "GROUP")
    }

    Notes:
    - User authentication/authorization is expected to be handled externally or extended here.
    - Uses database_sync_to_async to safely perform DB operations within async context.
    """

    async def connect(self):
        """
        Handles a new WebSocket connection.

        Joins the global chat group and accepts the connection.
        """
        self.room_name = 'global_chat'
        self.room_group_name = f'chat_{self.room_name}'

        # Add this channel to the chat group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        # Accept the WebSocket connection
        await self.accept()

    async def disconnect(self, close_code):
        """
        Handles WebSocket disconnection.

        Removes this channel from the chat group.
        """
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        """
        Handles incoming WebSocket messages.

        Parses the JSON message, validates and persists the chat message,
        and broadcasts it to the group.

        Args:
            text_data (str): JSON string containing the chat message data.
        """
        try:
            data = json.loads(text_data)
            user_id = data["user_id"]
            content = data["content"]
            visibility = data.get("visibility", "ALL")
            visible_roles = data.get("visible_roles", [])
            visible_users = data.get("visible_users", [])

            # Fetch the sending user from DB
            user = await database_sync_to_async(TWCCUser.objects.get)(pk=user_id)

            # Create the message instance
            message = await database_sync_to_async(Message.objects.create)(
                user=user,
                content=content,
                visibility=visibility,
            )

            # Add role visibility if applicable
            if visibility == "ROLES" and visible_roles:
                for rid in visible_roles:
                    role = await database_sync_to_async(Role.objects.get)(pk=int(rid))
                    await database_sync_to_async(message.visible_roles.add)(role)

            # Add user visibility if applicable
            if visibility == "GROUP" and visible_users:
                for uid in visible_users:
                    usr = await database_sync_to_async(TWCCUser.objects.get)(pk=uid)
                    await database_sync_to_async(message.visible_users.add)(usr)

            # Save the message after adding related visibility
            await database_sync_to_async(message.save)()

            # Serialize the message data for sending to clients
            serializer_data = await database_sync_to_async(
                lambda: MessageSerializer(message).data
            )()

            # Broadcast the serialized message to the group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': serializer_data
                }
            )
        except Exception as ex:
            # Log and close connection on error
            print(f"WebSocket receive error: {ex}")
            await self.close()

    async def chat_message(self, event):
        """
        Handler for sending messages to WebSocket clients.

        Args:
            event (dict): Contains serialized message data under 'message' key.
        """
        await self.send(text_data=json.dumps(event['message']))
