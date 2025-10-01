import {
  Component, Input, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebGLMap } from '@luciad/ria/view/WebGLMap.js';

import { FeatureLayer } from '@luciad/ria/view/feature/FeatureLayer.js';
import { RasterTileSetLayer } from '@luciad/ria/view/tileset/RasterTileSetLayer.js';
import { RasterTileSetModel } from '@luciad/ria/model/tileset/RasterTileSetModel.js';
import { RasterDataType } from '@luciad/ria/model/tileset/RasterDataType.js';
import { RasterImageLayer } from '@luciad/ria/view/image/RasterImageLayer.js';
import { GridLayer } from '@luciad/ria/view/grid/GridLayer.js';
import { LayerGroup } from '@luciad/ria/view/LayerGroup.js';
import { LayerTreeNodeType } from '@luciad/ria/view/LayerTreeNodeType.js';

type AnyNode = any;

interface LayerTreeNodeVM {
  id: string;
  label: string;
  visible: boolean;
  expanded: boolean;
  iconTitle: string;
  iconEmoji: string;          // simple fallback icon
  children: LayerTreeNodeVM[];
  ref: AnyNode;               // original node/layer
}

type DragOverPart = 'NONE' | 'TOP' | 'BOTTOM';

@Component({
  standalone: true,
  selector: 'ria-layertree',
  imports: [CommonModule],
  templateUrl: './layertree.component.ria.html',
  styleUrls: ['./layertree.component.ria.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayertreeComponentRia implements OnDestroy {
  // map arrives after parent creates it → use setter
  private _map?: WebGLMap;
  @Input() set map(value: WebGLMap | undefined) {
    if (value && value !== this._map) {
      this.disposeListeners();
      this._map = value;
      this.rebuild();
      this.installListeners(value);
      this.cdr.markForCheck();
      console.debug('[LayerTree] map bound & listeners installed');
    }
  }
  get map(): WebGLMap | undefined { return this._map; }

  @Output() panelCollapseToggled = new EventEmitter<{ collapsed: boolean }>();
  @Output() nodeExpandToggled   = new EventEmitter<{ id: string; label: string; expanded: boolean }>();
  @Output() nodeVisibilityToggled = new EventEmitter<{ id: string; label: string; visible: boolean }>();

  collapsed = false;
  nodes: LayerTreeNodeVM[] = [];

  private handles: Array<{ remove(): void } | (() => void)> = [];
  private rafQueued = false;

  // drag state
  draggingId: string | null = null;
  dragOver: Record<string, DragOverPart> = {};

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void { this.disposeListeners(); }

  // ── Panel ─────────────────────────────────────────────────────────────────
  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.panelCollapseToggled.emit({ collapsed: this.collapsed });
    this.cdr.markForCheck();
  }

  // ── Node actions ─────────────────────────────────────────────────────────
  toggleNodeExpand(n: LayerTreeNodeVM, ev?: MouseEvent): void {
    ev?.stopPropagation();
    n.expanded = !n.expanded;
    this.nodeExpandToggled.emit({ id: n.id, label: n.label, expanded: n.expanded });
    this.cdr.markForCheck();
  }

  toggleVisible(n: LayerTreeNodeVM, ev: MouseEvent): void {
    ev.stopPropagation();
    const ref: any = n.ref;
    if ('visible' in ref) {
      ref.visible = !ref.visible;
      n.visible = !!ref.visible;
    } else if (ref?.layer && 'visible' in ref.layer) {
      ref.layer.visible = !ref.layer.visible;
      n.visible = !!ref.layer.visible;
    }
    this.nodeVisibilityToggled.emit({ id: n.id, label: n.label, visible: n.visible });
    this.cdr.markForCheck();
  }

  async fitLayer(n: LayerTreeNodeVM, ev: MouseEvent) {
    ev.stopPropagation();
    if (!this._map) return;
    const bounds = await this.getNodeFitBounds(n.ref);
    if (bounds) {
      try {
        await this._map.mapNavigator.fit({ bounds, animate: true });
      } catch { /* no-op */ }
    }
  }

  deleteLayer(n: LayerTreeNodeVM, ev: MouseEvent) {
    ev.stopPropagation();
    const ref: any = n.ref;
    try {
      if (ref?.parent?.removeChild) {
        ref.parent.removeChild(ref);
      } else if (ref?.layer?.parent?.removeChild) {
        ref.layer.parent.removeChild(ref.layer);
      }
    } catch (e) {
      console.warn('Cannot delete layer', e);
    }
  }

  // ── Drag & Drop reorder ───────────────────────────────────────────────────
  dragStart(n: LayerTreeNodeVM, ev: DragEvent) {
    this.draggingId = n.id;
    ev.dataTransfer?.setData('text/plain', n.id);
    ev.dataTransfer?.setDragImage?.(new Image(), 0, 0); // invisible drag image
  }
  dragOverNode(n: LayerTreeNodeVM, ev: DragEvent) {
    ev.preventDefault(); // allow drop
    const target = ev.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const part: DragOverPart = (ev.clientY < midY) ? 'TOP' : 'BOTTOM';
    this.dragOver[n.id] = part;
    this.cdr.markForCheck();
  }
  dragLeaveNode(n: LayerTreeNodeVM) {
    delete this.dragOver[n.id];
    this.cdr.markForCheck();
  }
  dropOnNode(n: LayerTreeNodeVM, ev: DragEvent) {
    ev.preventDefault();
    const movingId = this.draggingId || ev.dataTransfer?.getData('text/plain');
    this.draggingId = null;
    const overPart = this.dragOver[n.id] || 'NONE';
    delete this.dragOver[n.id];

    if (!this._map || !movingId || movingId === n.id) return;

    try {
      const lt: any = this._map.layerTree;
      const layerToMove = lt.findLayerById ? lt.findLayerById(movingId) : this.findNodeById(lt, movingId);
      if (!layerToMove) return;

      const insertPos = this.determineInsertPosition(n.ref, overPart); // 'above' | 'top' | 'below'

      if (insertPos === 'top' && n.ref?.treeNodeType === LayerTreeNodeType.LAYER_GROUP) {
        (n.ref as LayerGroup).moveChild(layerToMove, 'top');
      } else {
        n.ref?.parent?.moveChild(layerToMove, insertPos, n.ref);
      }
    } catch (e) {
      console.warn('Cannot move layer', e);
    } finally {
      this.rebuild();
      this.cdr.markForCheck();
    }
  }

  // ── Template helpers ──────────────────────────────────────────────────────
  hasChildren(n: LayerTreeNodeVM) { return (n.children?.length ?? 0) > 0; }
  isDragTop(id: string) { return this.dragOver[id] === 'TOP'; }
  isDragBottom(id: string) { return this.dragOver[id] === 'BOTTOM'; }
  trackNode = (_: number, n: LayerTreeNodeVM) => n.id;

  // ── Internals ─────────────────────────────────────────────────────────────
  private disposeListeners() {
    for (const h of this.handles) {
      try {
        if (typeof h === 'function') {
          h();
        } else if (h && typeof (h as any).remove === 'function') {
          (h as any).remove();
        }
      } catch {}
    }
    this.handles = [];
  }

  private installListeners(map: WebGLMap): void {
    const refresh = () => {
      if (this.rafQueued) return;
      this.rafQueued = true;
      requestAnimationFrame(() => {
        this.rafQueued = false;
        this.rebuild();
        this.cdr.markForCheck();
      });
    };

    // Fallback: refresh on any map change
    // @ts-ignore
    const mapChange = map.on('MapChange', refresh);
    this.handles.push(mapChange);

    // Prefer layer-tree specific events if available
    const lt: any = map.layerTree;
    if (lt?.on) {
      for (const e of ['StructureChanged','ChildAdded','ChildRemoved','NodeMoved','LayerVisibilityChanged','LabelChanged']) {
        try {
          // @ts-ignore
          const h = lt.on(e, refresh);
          h && this.handles.push(h);
        } catch {}
      }
    }
  }

  private rebuild(): void {
    if (!this._map) { this.nodes = []; return; }
    const root: any = this._map.layerTree;
    this.nodes = this.extractChildren(root);
  }

  private extractChildren(node: AnyNode): LayerTreeNodeVM[] {
    // reverse so newest-on-top like sample
    return this.getChildren(node).slice().reverse().map((c) => this.toVM(c));
  }

  private toVM(node: AnyNode): LayerTreeNodeVM {
    const kids = this.getChildren(node);
    const label = this.getLabel(node);
    const visible = this.getVisible(node);
    const { iconEmoji, iconTitle } = this.getIcon(node, /*open*/ true);
    const id = this.getId(node, label);
    const children = kids.map((c: AnyNode) => this.toVM(c));
    const expanded = kids.length > 0;
    return { id, label, visible, expanded, iconEmoji, iconTitle, children, ref: node };
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

  private getLabel(n: AnyNode): string {
    return (n?.label ?? n?.layer?.label ?? n?.name ?? 'Layer').toString();
  }
  private getVisible(n: AnyNode): boolean {
    if (typeof n?.visible === 'boolean') return n.visible;
    if (typeof n?.layer?.visible === 'boolean') return n.layer.visible;
    return true;
  }
  private getId(n: AnyNode, fallback: string): string {
    return (n?.id ?? n?.uuid ?? n?.hashCode ?? fallback).toString();
  }

  private getIcon(node: AnyNode, open: boolean): { iconEmoji: string; iconTitle: string } {
    try {
      if (node instanceof FeatureLayer)       return { iconEmoji: '🗺️', iconTitle: 'Vector layer' };
      if (node instanceof RasterTileSetLayer) {
        if (node.model instanceof RasterTileSetModel) {
          const isElev = node.model.dataType === RasterDataType.ELEVATION;
          return { iconEmoji: isElev ? '⛰️' : '🖼️', iconTitle: isElev ? 'Elevation layer' : 'Raster imagery' };
        }
        return { iconEmoji: '🖼️', iconTitle: 'Raster imagery' };
      }
      if (node instanceof RasterImageLayer)   return { iconEmoji: '🖼️', iconTitle: 'Raster image' };
      if (node instanceof GridLayer)          return { iconEmoji: '🧮', iconTitle: 'Grid layer' };
      if (node.treeNodeType === LayerTreeNodeType.LAYER_GROUP) {
        return { iconEmoji: open ? '📂' : '📁', iconTitle: 'Layer group' };
      }
    } catch {}
    return { iconEmoji: '❓', iconTitle: 'Unknown layer type' };
  }

  private determineInsertPosition(node: AnyNode, part: DragOverPart): 'above' | 'top' | 'below' {
    if (part === 'TOP') return 'above';
    const isGroup = node?.treeNodeType === LayerTreeNodeType.LAYER_GROUP;
    return isGroup ? 'top' : 'below';
  }

  private findNodeById(root: AnyNode, id: string): AnyNode | null {
    if (!root) return null;
    const stack = this.getChildren(root).slice();
    while (stack.length) {
      const n = stack.pop();
      if (!n) break;
      if ((n.id ?? '').toString() === id) return n;
      const kids = this.getChildren(n);
      for (const k of kids) stack.push(k);
    }
    return null;
  }

  // Try common ways to get bounds; fallback to first child
  private async getNodeFitBounds(node: AnyNode): Promise<any | null> {
    try {
      const cand = node?.bounds ?? node?.layer?.bounds
        ?? (typeof node?.getBounds === 'function' ? node.getBounds() : null)
        ?? (typeof node?.layer?.getBounds === 'function' ? node.layer.getBounds() : null)
        ?? node?.model?.bounds
        ?? (typeof node?.model?.getBounds === 'function' ? node.model.getBounds() : null);
      if (cand) return cand;

      const kids = this.getChildren(node);
      for (const k of kids) {
        const b = await this.getNodeFitBounds(k);
        if (b) return b;
      }
    } catch {}
    return null;
  }
}
