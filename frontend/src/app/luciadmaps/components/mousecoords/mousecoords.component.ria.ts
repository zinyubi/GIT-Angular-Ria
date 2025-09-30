import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'ria-mousecoords',
  imports: [CommonModule],
  templateUrl: './mousecoords.component.ria.html',
  styleUrls: ['./mousecoords.component.ria.css']
})
export class MousecoordsComponentRia {
  @Input() point: any = null;           // Luciad Point
  @Input() referenceLabel = '';         // optional label (e.g., key or EPSG)

  // Defensive formatter that works with different Luciad point shapes
  fmt(p: any): string {
    if (!p) return '—';
    const arr =
      (Array.isArray(p?.coordinates) && p.coordinates) ||
      (typeof p?.toArray === 'function' && p.toArray()) ||
      (typeof p?.getX === 'function' && [p.getX(), p.getY?.(), p.getZ?.()]) ||
      ('x' in p && [p.x, p.y, p.z]) ||
      null;
    if (!arr) return '—';

    const [a, b, c] = arr;
    if (typeof c === 'number' && isFinite(c)) {
      return `${Number(a).toFixed(2)}, ${Number(b).toFixed(2)}, ${Number(c).toFixed(2)}`;
    }
    return `${Number(a).toFixed(2)}, ${Number(b).toFixed(2)}`;
  }
}
