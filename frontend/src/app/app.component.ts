import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Root component that hosts the router outlet.
 *
 * This is the main app component where Angular loads routed components.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {}
