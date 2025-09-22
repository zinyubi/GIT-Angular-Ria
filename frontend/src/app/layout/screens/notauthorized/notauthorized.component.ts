import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-not-authorized',
  template: `
    <div class="unauthorized">
      <h2>Screen Access Not Granted</h2>
      <p>You do not have permission to view this screen.</p>
    </div>
  `,
  styles: [`
    .unauthorized {
      text-align: center;
      padding: 2rem;
      color: var(--color-error);
    }
  `]
})
export class NotAuthorizedComponent {}
