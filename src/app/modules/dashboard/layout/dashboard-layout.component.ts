import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { LogoutUseCase } from '../../../domain/auth/use-cases';
import { AUTH_SESSION } from '../../../domain/auth/ports';
import { LOG_BOOK_SERVICE } from '../../../domain/logBook/ports';
import { LogBookAdapter } from '../../../infrastructure/logBook/logBook.adapter';
import { LogBookUseCases } from '../../../domain/logBook/use-cases/logBook.usecases';
import { ACTIONS } from '../../../shared/const/actions';
import { MODULES } from '../../../shared/const/modules';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
  providers: [
    {
      provide: LOG_BOOK_SERVICE,
      useClass: LogBookAdapter
    },
    LogBookUseCases
  ]
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  private authSession = inject(AUTH_SESSION);
  private logoutUseCase = inject(LogoutUseCase);
  private LogBookUseCases = inject(LogBookUseCases);

  title: string = '';
  menuItems = MENU_ITEMS;
  currentUserName: string | undefined = 'Invitado';

  isHandset = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result?.matches),
    takeUntil(this.destroy$)
  );

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

  ngOnInit(): void {
    const userSession = this.authSession.getUser();
    const nameFull = userSession?.name;
    const email = userSession?.email;
    this.currentUserName = nameFull ? nameFull : email?.split('@')?.[0];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  visibleMenuItems() {
    const isAdmin = this.authSession.getUser()?.isAdmin;
    return this.menuItems.filter((item) => this.router.url !== item.route && (!item.onlyAdmin || isAdmin));
  }

  toggleMenu() {
    this.sidenav.toggle();
  }

  async logout() {
    const userSession = this.authSession.getUser();
    await this.logoutUseCase.execute().then(() => {
      this.LogBookUseCases.createLogBook({
        date: new Date().valueOf(),
        action: ACTIONS.LOGOUT,
        user: userSession!,
        module: MODULES.AUTH,
        description: `Usuario ${userSession?.name} cerró sesión`,
      });
    });
    this.router.navigate(['/auth/login']);
  }
}
