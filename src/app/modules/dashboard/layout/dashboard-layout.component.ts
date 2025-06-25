import { Component, computed, inject } from '@angular/core';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MaterialModule } from '../../../shared/material/material.module';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterModule, MaterialModule],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav mode="side" opened>
        <mat-toolbar>Menú</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="users" routerLinkActive="active"
            >Usuarios</a
          >
          <a mat-list-item routerLink="vendors" routerLinkActive="active"
            >Vendedores</a
          >
          <a mat-list-item routerLink="parameterization-warnings" routerLinkActive="active"
            >Parametrización de alertas</a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <span>{{ sectionTitle() }}</span>
        </mat-toolbar>
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styleUrls: ['./dashboard-layout.component.scss'],
})



export class DashboardLayoutComponent {
  private router = inject(Router);
  title: Record<string, string> = {
    "/dashboard/users": "Usuario",
    "/dashboard/vendors": "Vendedores",
    "/dashboard/alert-parameterization": "Prametrización de alertas",
  }

  sectionTitle = computed(() => {
    const url = this.router.url as string;
    return this.title[url] || 'Inicio';
  });
}
