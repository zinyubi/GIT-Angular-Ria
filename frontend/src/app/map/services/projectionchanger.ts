import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigManager } from './configmanager.service';

@Component({
  standalone: true,
  selector: 'projectionchanger',
  imports: [CommonModule],
  template: `
    <label class="proj-label">
      Projection:
      <select (change)="onChange($event)">
        <option value="" disabled selected>Choose...</option>
        <option *ngFor="let key of keys" [value]="key">{{ key }}</option>
      </select>
    </label>
  `,
  styles: [`
    .proj-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text, #222);
    }

    select {
      padding: 4px 8px;
      font-size: 14px;
      border: 1px solid var(--color-border, #ccc);
      border-radius: 4px;
      background: var(--panel, #fff);
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
    }

    select:hover {
      border-color: var(--accent, #3b82f6);
      background: var(--panel-strong, #f5f7fa);
    }

    select:focus {
      outline: none;
      border-color: var(--accent, #3b82f6);
      box-shadow: 0 0 0 2px var(--accentSoft, rgba(59, 130, 246, 0.3));
    }
  `]
})
export class ProjectionChanger implements OnInit {
  keys: string[] = [];
  @Output() choose = new EventEmitter<string>();

  constructor(private cfg: ConfigManager) {}

  ngOnInit(): void {
    this.keys = this.cfg.getProjectionKeys();
  }

  onChange(e: Event): void {
    const val = (e.target as HTMLSelectElement | null)?.value ?? '';
    if (val && this.keys.includes(val)) {
      this.choose.emit(val);
    }
  }
}
