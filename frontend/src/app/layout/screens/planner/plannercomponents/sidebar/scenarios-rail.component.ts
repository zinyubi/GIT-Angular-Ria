import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Scenario } from '../../../../../core/auth/services/scenario.service';

@Component({
  standalone: true,
  selector: 'app-scenarios-rail',
  imports: [CommonModule, FormsModule],
  templateUrl: './scenarios-rail.component.html',
  styleUrls: ['./scenarios-rail.component.css'],
})
export class ScenariosRailComponent {
  @Input() collapsed = true;
  @Output() collapseChange = new EventEmitter<boolean>();

  @Input() scenarios: Scenario[] = [];
  @Input() selectedScenario: Scenario | null = null;

  @Input() editing = false;
  @Input() form: { name: string; description?: string } = { name: '', description: '' };
  @Input() errorMessage = '';

  @Output() createScenario = new EventEmitter<void>();
  @Output() editScenario = new EventEmitter<void>();
  @Output() cancelEdit = new EventEmitter<void>();
  @Output() saveScenario = new EventEmitter<void>();
  @Output() deleteScenario = new EventEmitter<Scenario>();
  @Output() selectScenario = new EventEmitter<Scenario>();

  @Output() expandTo = new EventEmitter<'create' | 'edit' | 'list'>();

  @ViewChild('listBlock', { static: false }) listBlock?: ElementRef<HTMLElement>;

  expand() { this.collapseChange.emit(false); }
  collapse() { this.collapseChange.emit(true); }
  expandAnd(section: 'create' | 'edit' | 'list') { this.expandTo.emit(section); }

  trackByScenarioId = (_: number, s: Scenario) => s.id;
}
