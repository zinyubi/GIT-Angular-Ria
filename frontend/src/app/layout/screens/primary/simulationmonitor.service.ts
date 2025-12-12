// src/app/views/primary/simulationmonitor.service.ts
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WS_URLS } from '../../../config/api.config';

export interface SimulationOverview {
  scenario_id: number;
  scenario_name: string;
  state: string;
  started_by: string | null;
  started_at: string | null;
}

interface MonitorSnapshotMessage {
  type: 'monitor_snapshot';
  simulations: SimulationOverview[];
  timestamp: string;
}

interface SimulationStateMessage {
  type: 'simulation_state';
  scenario_id: number;
  scenario_name: string;
  state: string;
  started_by: string | null;
  started_at: string | null;
}

type MonitorIncoming = MonitorSnapshotMessage | SimulationStateMessage | any;

@Injectable({
  providedIn: 'root',
})
export class SimulationMonitorService {
  private socket?: WebSocket;

  private simulationsSubject = new BehaviorSubject<SimulationOverview[]>([]);
  private connectedSubject = new BehaviorSubject<boolean>(false);

  simulations$: Observable<SimulationOverview[]> = this.simulationsSubject.asObservable();
  connected$: Observable<boolean> = this.connectedSubject.asObservable();

  constructor(private zone: NgZone) {}

  /** Public connect so components can call it. */
  connect(): void {
    if (this.socket) {
      return;
    }

    const baseUrl = WS_URLS.MONITOR;
    const socket = new WebSocket(baseUrl);
    this.socket = socket;

    socket.onopen = () => {
      this.zone.run(() => {
        this.connectedSubject.next(true);
      });
    };

    socket.onclose = () => {
      this.zone.run(() => {
        this.connectedSubject.next(false);
        this.simulationsSubject.next([]);
        this.socket = undefined;
      });
    };

    socket.onerror = () => {
      this.zone.run(() => {
        this.connectedSubject.next(false);
      });
    };

    socket.onmessage = (event) => {
      this.zone.run(() => {
        try {
          const data: MonitorIncoming = JSON.parse(event.data);

          switch (data.type) {
            case 'monitor_snapshot': {
              const msg = data as MonitorSnapshotMessage;
              this.simulationsSubject.next(msg.simulations || []);
              break;
            }
            case 'simulation_state': {
              const msg = data as SimulationStateMessage;
              const current = this.simulationsSubject.value.slice();
              const idx = current.findIndex(
                (s) => s.scenario_id === msg.scenario_id,
              );
              const updated: SimulationOverview = {
                scenario_id: msg.scenario_id,
                scenario_name: msg.scenario_name,
                state: msg.state,
                started_by: msg.started_by,
                started_at: msg.started_at,
              };
              if (idx >= 0) {
                current[idx] = updated;
              } else {
                current.push(updated);
              }
              this.simulationsSubject.next(current);
              break;
            }
            default:
              // ignore unknown type
              break;
          }
        } catch {
          // ignore parse errors
        }
      });
    };
  }

  disconnect(): void {
    if (this.socket) {
      try {
        this.socket.close();
      } catch {
        // ignore
      }
      this.socket = undefined;
    }
  }
}
