import {
  Component, EventEmitter, Output, ViewChild, Input,
  OnChanges, SimpleChanges, AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { WebGLMap } from '@luciad/ria/view/WebGLMap.js';

import { MapComponentRia } from '../../../../../luciadmaps/components/map/map.component.ria';
import { Scenario } from '../../../../../core/auth/services/scenario.service';

import { RiaVizFacade } from './../../../../../luciadmaps/components/util/riavisualization/index';
import { setWrapNormalization, setWgsSource } from './../../../../../luciadmaps/components/util/riavisualization/riaviz.utils';

type AnyNode = any;

@Component({
  standalone: true,
  selector: 'app-map-panel',
  imports: [CommonModule, MapComponentRia],
  templateUrl: './map-panel.component.html',
  styleUrls: ['./map-panel.component.css'],
})
export class MapPanelComponent implements OnChanges, AfterViewInit {
  @ViewChild(MapComponentRia) mapCmp?: MapComponentRia;

  @Input() scenario: Scenario | null = null;
  @Output() pointPicked = new EventEmitter<{ lon: number; lat: number }>();

  private map?: WebGLMap;
  private viz?: RiaVizFacade;

  private currentLayerId?: string;           // track by id (not label)
  private pendingScenario?: Scenario | null; // queue updates until map is ready

  // ──────────────────────────── Lifecycle ────────────────────────────
  ngAfterViewInit() {
    this.map = (this.mapCmp as any)?.map as WebGLMap | undefined;
    if (!this.map) return;

    setWrapNormalization((this.map as any).wrapAroundWorld ?? false);
    setWgsSource('CRS:84');

    this.viz = new RiaVizFacade(this.map);

    if (this.pendingScenario !== undefined) {
      this.rebuildScenarioLayer(this.pendingScenario);
      this.pendingScenario = undefined;
    } else if (this.scenario) {
      this.rebuildScenarioLayer(this.scenario);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['scenario']) {
      if (!this.map || !this.viz) {
        this.pendingScenario = this.scenario ?? null; // queue until map ready
      } else {
        this.rebuildScenarioLayer(this.scenario);
      }
    }
  }

  // ──────────────────────────── Core Logic ────────────────────────────
  private rebuildScenarioLayer(s: Scenario | null) {
    if (!this.map || !this.viz) return;

    // 1) remove previously created scenario layer by id
    if (this.currentLayerId) {
      this.removeNodeById(this.currentLayerId);
      this.currentLayerId = undefined;

      // 🔸 force the layer tree to rebuild after removal
      this.mapCmp?.refreshLayerTree();
    }

    if (!s) {
      (this.map as any).repaint?.();
      return;
    }

    // 2) label from Scenario (no 'label' property)
    const label = `Scenario: ${s.name || String(s.id ?? 'Unnamed')}`;

    // 3) ask the facade to create or get the layer (facade will attach it)
    const created = this.viz.getOrCreateLayer({
      label,
      kind: 'point',
      style: {
        point: {
          symbol: 'circle',
          size: 8,
          fill: '#6aa0ff',
          outline: '#fff',
          outlineWidth: 1,
        },
      },
    });

    // Many facades return a wrapper { id, layer }, others return the layer node directly
    const layerNode: AnyNode = (created as any)?.layer ?? created;
    const createdId: string =
      ((created as any)?.id ?? layerNode?.id ?? label).toString();

    this.currentLayerId = createdId;

    // 4) try to bring it to top within its current parent (no re-parenting)
    try {
      layerNode?.parent?.moveChild?.(layerNode, 'top');
    } catch { /* no-op */ }

    // 5) activate via facade if it exposes an id; fall back to node id
    try {
      this.viz.setActiveLayer((created as any)?.id ?? layerNode?.id ?? label);
    } catch { /* no-op */ }

    (this.map as any).repaint?.();

    // 🔸 force the layer tree to rebuild after creation
    this.mapCmp?.refreshLayerTree();

    console.info('[MapPanel] Scenario layer rebuilt:', label, this.currentLayerId);

    // Optional: for builds that support manual signalling
    try {
      const lt: any = (this.map as any)?.layerTree;
      lt?.fire?.('StructureChanged');
      lt?.notifyStructureChanged?.();
    } catch { /* no-op */ }
  }

  /** Remove a LayerTree node by id anywhere in the tree (safe for mixed node types). */
  private removeNodeById(id: string) {
    const lt: AnyNode = (this.map as any)?.layerTree;
    if (!lt) return;

    const stack: AnyNode[] = (this.getChildren(lt) || []).slice();
    while (stack.length) {
      const n = stack.pop();
      if (!n) continue;
      const nid = (n.id ?? n.uuid ?? n.hashCode)?.toString?.();
      if (nid === id) {
        try {
          n.parent?.removeChild?.(n);
        } catch {
          try { lt.removeChild?.(n); } catch { /* no-op */ }
        }
        return;
      }
      for (const c of this.getChildren(n)) stack.push(c);
    }
  }

  private getChildren(n: AnyNode): AnyNode[] {
    if (!n) return [];
    if (Array.isArray(n.children)) return n.children;
    if (n.children && typeof n.children[Symbol.iterator] === 'function') {
      try { return Array.from(n.children); } catch {}
    }
    if (typeof n.childCount === 'number' && typeof n.child === 'function') {
      const arr: AnyNode[] = [];
      for (let i = 0; i < n.childCount; i++) arr.push(n.child(i));
      return arr;
    }
    return [];
  }

  // ──────────────────────────── Passthroughs ────────────────────────────
  startPointPicking() { this.mapCmp?.startPointPicking(); }
  stopPointPicking()  { this.mapCmp?.stopPointPicking(); }
  onPointPicked(evt: { lon: number; lat: number }) { this.pointPicked.emit(evt); }
}
