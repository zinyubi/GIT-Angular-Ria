import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebGLMap } from '@luciad/ria/view/WebGLMap.js';
import { getReference } from '@luciad/ria/reference/ReferenceProvider.js';
import { createBounds } from '@luciad/ria/shape/ShapeFactory.js';

import { RiaMapConfigService } from '../../ria-map-config.service';
import { DEFAULT_BASELAYER_CONFIG_RIA } from './../../ria-map-config.service';
import { BaseLayerServiceRia } from '../../services/base-layer.ria.service';
import { RiaProjectionswitcherComponent } from '../projectionswitcher/riaprojectionswitcher.component';
import { MouseCoordinateServiceRia } from '../../services/mouse-coordinate.ria.service';
import { MousecoordsComponentRia } from '../mousecoords/mousecoords.component.ria';
import { CompassServiceRia } from './../../services/compass.ria.service';
import { LayertreeComponentRia } from './../layertree/layertree.component.ria';
import { WMSTileSetModel } from '@luciad/ria/model/tileset/WMSTileSetModel.js';
import { WMSTileSetLayer } from '@luciad/ria/view/tileset/WMSTileSetLayer.js';

import { Observable } from 'rxjs';
import { Point } from '@luciad/ria/shape/Point.js';

@Component({
  standalone: true,
  selector: 'riamap',
  imports: [
    CommonModule,
    RiaProjectionswitcherComponent,
    MousecoordsComponentRia,
    LayertreeComponentRia,
  ],
  templateUrl: './map.component.ria.html',
  styleUrls: ['./map.component.ria.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponentRia implements AfterViewInit {
  @ViewChild('mapDiv', { static: true }) mapDiv!: ElementRef<HTMLDivElement>;
  public map?: WebGLMap;

  compassTransform = 'rotateZ(0deg)';
  private mapChangeHandle: { remove(): void } | null = null;
  private rafQueued = false;

  // declare here, initialize in constructor (after DI)
  modelPoint$!: Observable<Point | null>;
  currentProjKey: string;

  constructor(
    private cfg: RiaMapConfigService,
    private baseLayersRia: BaseLayerServiceRia,
    private mouseCoordsRia: MouseCoordinateServiceRia,
    private compassServiceRia: CompassServiceRia,
  ) {
    this.modelPoint$ = this.mouseCoordsRia.model$();
    this.currentProjKey = this.cfg.getDefaultKey();
  }

  ngOnDestroy(): void {
    this.mapChangeHandle?.remove?.();
    this.mapChangeHandle = null;
  }

  private updateCompassTransform() {
    if (!this.map) return;
    this.compassTransform = this.compassServiceRia.cssRotationForMapRia(this.map);
  }

  async ngAfterViewInit(): Promise<void> {
    // Use your default projection (kept simple and 2D for now)
    const refCode = this.cfg.getDefaultProjection().reference; // e.g., EPSG:3857
    const reference = getReference(refCode);
    this.updateCompassTransform();

    // Create the map on the DIV element
    this.map = new WebGLMap(this.mapDiv.nativeElement, { reference });

    // Fit to the world so something obvious shows
    const world = createBounds(reference, [-180, -90, 180, 90]);



    WMSTileSetModel.createFromURL("https://sampleservices.luciad.com/wms", [{layer: "rivers"}])
    .then((model) => {
      //Create a layer for the WMS model
      const layer = new WMSTileSetLayer(model);
      this.map?.layerTree.addChild(layer);
    });

    // Add default base layers from config (WMS + optional elevation)
    await this.baseLayersRia.addBaseLayersFromConfigRia(
      this.map,
      DEFAULT_BASELAYER_CONFIG_RIA
    );

    // Start mouse coord tracking in current reference
    this.mouseCoordsRia.start(this.map, getReference('CRS:84'));

    // @ts-ignore map.on returns a handle with remove()
    this.mapChangeHandle = this.map.on('MapChange', () => {
      if (this.rafQueued) return;
      this.rafQueued = true;
      requestAnimationFrame(() => {
        this.rafQueued = false;
        this.updateCompassTransform();
      });
    });





  }



  onPanelCollapseToggled(e: { collapsed: boolean }) {
  console.debug('[LayerTree] panelCollapseToggled', e);
  }
  onNodeExpandToggled(e: { id: string; label: string; expanded: boolean }) {
    console.debug('[LayerTree] nodeExpandToggled', e);
  }
  onNodeVisibilityToggled(e: { id: string; label: string; visible: boolean }) {
    console.debug('[LayerTree] nodeVisibilityToggled', e);
  }




  rotateNorth(): void {
    if (!this.map) return;
    this.compassServiceRia.rotateToNorthRia(this.map);
  }

  // === Zoom buttons hook this ===
  zoomBy(factor: number) {
    if (!this.map) return;
    this.map.mapNavigator.zoom({ factor, animate: true });
  }

  onProjectionChoose(key: string) {
    if (!this.map) return;
    const cfg = this.cfg.getProjectionConfig(key);
    if (!cfg) return;

    const reference = getReference(cfg.reference);
    this.map.reference = reference;
    this.currentProjKey = key;

    // Restart mouse coord tracking for the new reference
    this.mouseCoordsRia.start(this.map, getReference('CRS:84'));
    this.updateCompassTransform();
  }
}
