import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Read credentials from environment or set defaults
DB_NAME = os.environ.get('POSTGRES_DB', 'TWCCDatabaseRia')
DB_USER = os.environ.get('POSTGRES_USER', 'postgres')
DB_PASSWORD = os.environ.get('POSTGRES_PASSWORD', 'admin')
DB_HOST = os.environ.get('POSTGRES_HOST', 'localhost')
DB_PORT = os.environ.get('POSTGRES_PORT', '5432')

def ensure_database():
    # Connect to the server not a database
    con = psycopg2.connect(dbname='postgres', user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT)
    con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = con.cursor()
    # Check if DB exists, else create it
    cur.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s", (DB_NAME,))
    exists = cur.fetchone()
    if not exists:
        cur.execute(f'CREATE DATABASE "{DB_NAME}"')
        print(f"Database {DB_NAME} created")
    else:
        
        print(f"Database {DB_NAME} already exists")
    cur.close()
    con.close()

if __name__ == "__main__":
    ensure_database()