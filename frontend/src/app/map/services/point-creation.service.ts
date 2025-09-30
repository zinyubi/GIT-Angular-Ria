import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PointCreationService {
  private mapElement?: HTMLElement;
  private clickHandler?: (event: MouseEvent | PointerEvent) => void;

  activate(mapElementId: string, onClick: (event: MouseEvent | PointerEvent) => void): void {
    this.deactivate();

    const mapElement = document.getElementById(mapElementId);
    if (!mapElement) {
      console.error('[PointPick] Map element not found:', mapElementId);
      return;
    }

    this.clickHandler = (event: MouseEvent | PointerEvent) => {
      // Only primary button
      if ('button' in event && event.button !== 0) return;

      const rect = mapElement.getBoundingClientRect();
      const within =
        (event as MouseEvent).clientX >= rect.left &&
        (event as MouseEvent).clientX <= rect.right &&
        (event as MouseEvent).clientY >= rect.top &&
        (event as MouseEvent).clientY <= rect.bottom;

      if (!within) return;

      console.log('[PointPick] click @', {
        x: (event as MouseEvent).clientX,
        y: (event as MouseEvent).clientY,
      });

      onClick(event);
    };

    this.mapElement = mapElement;

    // Capture phase to beat stopPropagation in the map canvas
    const opts = { capture: true as const, passive: true as const };
    mapElement.addEventListener('pointerdown', this.clickHandler, opts);
    mapElement.addEventListener('click', this.clickHandler, opts);

    console.log('✅ Point creation mode activated');
  }

  deactivate(): void {
    if (this.mapElement && this.clickHandler) {
      this.mapElement.removeEventListener('pointerdown', this.clickHandler as any, { capture: true } as any);
      this.mapElement.removeEventListener('click', this.clickHandler as any, { capture: true } as any);
      console.log('Point creation mode deactivated');
    }
    this.clickHandler = undefined;
    this.mapElement = undefined;
  }
}
