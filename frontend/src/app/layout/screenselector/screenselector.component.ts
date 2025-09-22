import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

interface Screen {
  name: string;
  path: string;
  isAuthorized: boolean;
}

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './screenselector.component.html',
  styleUrls: ['./screenselector.component.css'],
})
export class ScreenSelectorComponent implements OnInit {
  @Input() userScreens: Screen[] = [];

  currentPath: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.currentPath = e.urlAfterRedirects;
      });
  }

  isActiveScreen(screen: Screen): boolean {
    const fullPath = '/' + screen.path;
    return this.router.isActive(fullPath, {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }
}
