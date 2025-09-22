import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-planner',
  template: `
    <div class="planner">
      <h2>Planner Screen</h2>
      <p>This is Planner screen</p>
    </div>
  `,
  styles: [`
    .planner {
      text-align: center;
      padding: 2rem;
      color: var(--color-error);
    }
  `]
})
export class PlannerComponent {}
