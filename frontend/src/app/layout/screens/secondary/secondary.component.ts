import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-secondary',
  template: `
    <div class="secondary">
      <h2>Secondary Screen</h2>
      <p>This is secondary screen</p>
    </div>
  `,
  styles: [`
    .secondary {
      text-align: center;
      padding: 2rem;
      color: var(--color-error);
    }
  `]
})
export class SecondaryComponent {}
