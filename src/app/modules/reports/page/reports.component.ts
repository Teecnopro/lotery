import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { CompareBetsComponent } from '../components/compare-bets/compare-bets.component';
import { ByUsersBetsComponent } from '../components/by-users-bets/by-users-bets.component';
import { MaterialModule } from '../../../shared/material/material.module';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CompareBetsComponent,
    ByUsersBetsComponent,
    MaterialModule,
    CommonModule,
  ],
  template: `
    <div class="toolbar">
      <button
        mat-raised-button
        color="primary"
        (click)="toggleReports('compare')"
      >
        Reporte entre meses
      </button>
      <button
        mat-raised-button
        color="primary"
        (click)="toggleReports('byUser')"
      >
        Reporte de apuestas por usuario
      </button>
    </div>

    <div class="layout" [class.column]="isMobile">
      <div class="table-section" *ngIf="selectedReport === 'compare'">
        <app-compare-bets></app-compare-bets>
      </div>
      <div class="table-section" *ngIf="selectedReport === 'byUser'">
        <app-by-users-bets></app-by-users-bets>
      </div>
    </div>
  `,
  styleUrl: './reports.component.scss',
})
export class ReportsComponent implements OnInit, OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);
  private destroy$ = new Subject<void>();

  isMobile: boolean = false;
  selectedReport: 'compare' | 'byUser' | null = null;

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.isMobile = res?.matches;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleReports(report: 'compare' | 'byUser') {
    this.selectedReport = report;
  }
}
