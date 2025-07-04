import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';

import { IFormValues } from '../../interface/IReports.interface';
import { CompareBetsUseCase } from '../../../../domain/reports/use-cases';
import { ListCompareBetsComponent } from './list-compare-bets/list-compare-bets.component';
import { VendorComparison } from '../../../../domain/reports/models/vendor-comparison.entity';
import { NOTIFICATION_PORT } from '../../../../shared/ports';
import { getFirebaseAuthErrorMessage } from '../../../../shared/function/getFirebaseLoginErrorMessage.function';
import { MaterialModule } from '../../../../shared/material/material.module';
import { MONTHS } from '../../const/month';
import { FormCompareBetsComponent } from '../../../../shared/components/form-compare-bets/form-compare-bets.component';

@Component({
  selector: 'app-compare-bets',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormCompareBetsComponent,
    ListCompareBetsComponent,
  ],
  template: ` <div class="toolbar">
      <button mat-raised-button color="primary" (click)="toggleForm()">
        {{ showForm ? 'Mostrar filtros' : 'Ocultar filtros' }}
      </button>
    </div>

    <div class="layout" [class.column]="isMobile">
      <div class="form-section" [hidden]="!showForm">
        <app-form-compare-bets
          (valuesForm)="applyFilter($event)"
           [loading]="isLoading"
        ></app-form-compare-bets>
      </div>

      <div class="table-section">
        <app-list-compare-bets
          [vendorComparisionData]="vendorComparisionData"
          [loading]="isLoading"
        ></app-list-compare-bets>
      </div>
    </div>`,
  styleUrl: './compare-bets.component.scss',
})
export class CompareBetsComponent implements OnInit, OnDestroy {
  private compareBetsUseCase = inject(CompareBetsUseCase);
  private breakpointObserver = inject(BreakpointObserver);
  private destroy$ = new Subject<void>();
  private notification = inject(NOTIFICATION_PORT);

  isMobile: boolean = false;
  isLoading: boolean = false;

  vendorComparisionData!: {
    vendorComparision: VendorComparison[];
    month1Label: string;
    month2Label: string;
  };
  showForm: boolean = false;

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

  async applyFilter(valueForms: IFormValues) {
    this.isLoading = true;
    try {
      const report = await this.compareBetsUseCase.execute(valueForms);
      const { month1, month2 } = valueForms;

      const { month1Label, month2Label } = MONTHS.reduce(
        (acc, m) => {
          if (m.value === month1) acc.month1Label = m.label;
          if (m.value === month2) acc.month2Label = m.label;
          return acc;
        },
        { month1Label: 'Mes 1', month2Label: 'Mes 2' }
      );

      this.vendorComparisionData = {
        vendorComparision: report,
        month1Label,
        month2Label,
      };
    } catch (error) {
      this.notification.error(getFirebaseAuthErrorMessage(error));
    } finally {
      this.isLoading = false;
    }
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }
}
