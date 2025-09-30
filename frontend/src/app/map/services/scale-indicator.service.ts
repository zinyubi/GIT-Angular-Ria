import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getUnitOfMeasure } from '@luciad/ria/uom/UnitOfMeasureRegistry.js';
import { UnitOfMeasure } from '@luciad/ria/uom/UnitOfMeasure.js';

const INCH_TO_CM = 2.54, CM_TO_M = 100, DPI = 96;

@Injectable({ providedIn: 'root' })
export class ScaleIndicatorService {
  private sizesSubject = new BehaviorSubject({ width: 200, left: 0 });
  private textSubject = new BehaviorSubject('---');

  sizes$ = this.sizesSubject.asObservable();
  text$  = this.textSubject.asObservable();

  private readonly METER = getUnitOfMeasure('Meter');
  private readonly CM    = getUnitOfMeasure('Centimeter');
  private readonly KM    = getUnitOfMeasure('Kilometer');
  private readonly MILE  = getUnitOfMeasure('Mile');
  private readonly FT    = getUnitOfMeasure('Foot');

  update(mapScale: number, maxWidthPx: number, uom?: UnitOfMeasure): void {
    const pxScale = mapScale * (DPI / INCH_TO_CM) * CM_TO_M;
    const barLenM = maxWidthPx / pxScale;

    const unit = this.pickUOM(uom ?? this.METER, barLenM);
    const niceLenInUnit = this.lower125(unit.convertFromStandard(barLenM));
    const barPx = pxScale * unit.convertToStandard(niceLenInUnit);

    this.sizesSubject.next({ width: barPx, left: (maxWidthPx - barPx) / 2 });
    this.textSubject.next(`${niceLenInUnit} ${unit.symbol}`);
  }

  private pickUOM(unit: UnitOfMeasure, meters: number): UnitOfMeasure {
    const v = unit.convertFromStandard(meters);
    if (unit === this.METER && v > 1000) return this.KM;
    if (unit === this.METER && v < 1)    return this.CM;
    if (unit === this.KM && v < 1)       return this.METER;
    if (unit === this.FT && this.MILE.convertFromStandard(meters) > 1) return this.MILE;
    if (unit === this.MILE && v < 1)     return this.FT;
    return unit;
  }

  // 1-2-5 lower nice number
  private lower125(x: number): number {
    if (x <= 0) return 0;
    const exp = Math.floor(Math.log10(x));
    const frac = x / Math.pow(10, exp);
    const base = frac >= 5 ? 5 : frac >= 2 ? 2 : 1;
    return base * Math.pow(10, exp);
  }
}
