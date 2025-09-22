import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-inventory-manager',
  template: `
    <div class="inventory">
      <h2>Inventory Manager Screen</h2>
      <p>This is Inventory Manager screen</p>
    </div>
  `,
  styles: [`
    .inventory {
      text-align: center;
      padding: 2rem;
      color: var(--color-error);
    }
  `]
})
export class InventoryManagerComponent {}
