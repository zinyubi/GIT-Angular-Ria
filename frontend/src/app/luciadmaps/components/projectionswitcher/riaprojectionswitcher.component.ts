import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RiaMapConfigService } from './../../riamapconfig.service';

@Component({
  standalone: true,
  selector: 'ria-projectionswitcher',
  imports: [CommonModule],
  templateUrl: './riaprojectionswitcher.component.html',
  styleUrls: ['./riaprojectionswitcher.component.css']
})
export class RiaProjectionswitcherComponent implements OnInit {
  keys: string[] = [];
  @Output() choose = new EventEmitter<string>();

  constructor(private cfg: RiaMapConfigService) {}

  ngOnInit(): void {
    this.keys = this.cfg.getProjectionKeys();
  }

  onChange(e: Event): void {
    const val = (e.target as HTMLSelectElement | null)?.value ?? '';
    // only emit if exists in config (guard against null/empty)
    if (val && this.keys.includes(val)) {
      this.choose.emit(val);
    }
  }
}
