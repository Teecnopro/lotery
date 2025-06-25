import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, ViewChild } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { MatSidenav } from '@angular/material/sidenav';
import { filter, map, mergeMap, Subject, takeUntil } from 'rxjs';

import { MaterialModule } from '../../../shared/material/material.module';
import { MENU_ITEMS } from '../const/menuItems';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
})
export class DashboardLayoutComponent implements OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  title: string = '';
  menuItems = MENU_ITEMS;

  isHandset = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));

  constructor() {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        map(() => this.route),
        map((activatedRoute) => {
          while (activatedRoute.firstChild)
            activatedRoute = activatedRoute.firstChild;
          return activatedRoute;
        }),
        mergeMap((finalRoute) => finalRoute?.data),
        takeUntil(this.destroy$)
      )
      .subscribe((routeData) => {
        this.title = routeData['title'] ?? 'Inicio';
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  visibleMenuItems() {
    return this.menuItems.filter((item) => this.router.url !== item.route);
  }

  toggleMenu() {
    this.sidenav.toggle();
  }
}
