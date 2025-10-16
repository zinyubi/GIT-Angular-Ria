import { Injectable, Inject } from '@angular/core';
import { catchError, of } from 'rxjs';
import { PlannerState } from '../state/planner.state';
import { ScenarioService, Scenario } from '../../../../../core/auth/services/scenario.service';

@Injectable({ providedIn: 'root' })
export class ScenariosFacade {
  constructor(
    private s: PlannerState,
    @Inject(ScenarioService) private api: ScenarioService   // 👈 explicit token
  ) {}

  loadScenarios() {
    this.s.loadingScenarios$.next(true);
    this.api.getAllScenarios()
      .pipe(catchError(err => { console.error('Failed to load scenarios', err); return of<Scenario[]>([]); }))
      .subscribe(list => {
        this.s.scenarios$.next(list ?? []);
        this.s.loadingScenarios$.next(false);

        const selected = this.s.selectedScenario$.value;
        if (selected && !this.s.scenarios$.value.find(x => x.id === selected.id)) {
          this.s.selectedScenario$.next(null);
          this.s.deployedAircrafts$.next([]);
        }
      });
  }

  selectScenario(s: Scenario, onSelected?: () => void) {
    this.s.selectedScenario$.next(s);
    this.s.editing$.next(false);
    this.s.form$.next({ name: s.name, description: s.description || '' });
    onSelected?.();
  }

  createScenario() {
    this.s.form$.next({ name: '', description: '' });
    this.s.editing$.next(true);
    this.s.selectedScenario$.next(null);
    this.s.scenarioError$.next('');
  }

  editScenario() {
    if (!this.s.selectedScenario$.value) return;
    this.s.editing$.next(true);
    this.s.scenarioError$.next('');
  }

  cancelEditScenario() {
    this.s.editing$.next(false);
    this.s.scenarioError$.next('');
    const current = this.s.selectedScenario$.value;
    if (current) {
      this.s.form$.next({ name: current.name, description: current.description || '' });
    } else {
      this.s.form$.next({ name: '', description: '' });
    }
  }

  saveScenario() {
    const form = this.s.form$.value;
    this.s.scenarioError$.next('');
    if (!form.name?.trim()) { this.s.scenarioError$.next('Scenario name is required.'); return; }

    this.s.savingScenario$.next(true);
    const selected = this.s.selectedScenario$.value;

    if (selected?.id && this.s.editing$.value) {
      this.api.updateScenario(selected.id, form).subscribe({
        next: updated => {
          const arr = this.s.scenarios$.value.map(x => x.id === updated.id ? updated : x);
          this.s.scenarios$.next(arr);
          this.s.selectedScenario$.next(updated);
          this.s.editing$.next(false);
        },
        error: err => { console.error('Failed to update scenario', err); this.s.scenarioError$.next(err?.message || 'Failed to save scenario.'); },
        complete: () => this.s.savingScenario$.next(false),
      });
      return;
    }

    this.api.createScenario(form).subscribe({
      next: created => {
        this.s.scenarios$.next([...this.s.scenarios$.value, created]);
        this.s.selectedScenario$.next(created);
        this.s.editing$.next(false);
      },
      error: err => { console.error('Failed to create scenario', err); this.s.scenarioError$.next(err?.message || 'Failed to create scenario.'); },
      complete: () => this.s.savingScenario$.next(false),
    });
  }

  deleteScenario(scn: Scenario) {
    if (!scn?.id) return;
    if (!window.confirm('Delete this scenario?')) return;
    this.api.deleteScenario(scn.id).subscribe({
      next: () => {
        this.s.scenarios$.next(this.s.scenarios$.value.filter(x => x.id !== scn.id));
        if (this.s.selectedScenario$.value?.id === scn.id) {
          this.s.selectedScenario$.next(null);
          this.s.editing$.next(false);
          this.s.deployedAircrafts$.next([]);
        }
      },
      error: err => { console.error('Failed to delete scenario', err); alert('Failed to delete scenario.'); },
    });
  }
}
