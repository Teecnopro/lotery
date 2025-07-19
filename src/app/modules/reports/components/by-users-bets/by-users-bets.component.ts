import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { MaterialModule } from '../../../../shared/material/material.module';
import { CompareBetsByLotery } from '../../../../domain/reports/use-cases';
import { NOTIFICATION_PORT } from '../../../../shared/ports';
import { IFormValues } from '../../interface/IReports.interface';
import { UserComparison } from '../../../../domain/reports/models/vendor-comparison.entity';
import { getFirebaseAuthErrorMessage } from '../../../../shared/function/getFirebaseLoginErrorMessage.function';
import { FormCompareBetsComponent } from '../../../../shared/components/form-compare-bets/form-compare-bets.component';
import { ListByUsersBetsComponent } from './list-by-users-bets/list-by-users-bets.component';

@Component({
  selector: 'app-by-users-bets',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormCompareBetsComponent,
    ListByUsersBetsComponent,
  ],
  template: `
    <div class="toolbar">
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
        <app-list-by-users-bets
          [userComparisionData]="userComparisionData"
          [loading]="isLoading"
          [total]="totalItems"
          [pageIndex]="pageIndex"
          [pageSize]="pageSize"
          [overallTotal]="overallTotal"
          (changePage)="
            applyFilter(lastFormValues, $event.pageIndex, $event.pageSize)
          "
        ></app-list-by-users-bets>
      </div>
    </div>
  `,
  styleUrl: './by-users-bets.component.scss',
})
export class ByUsersBetsComponent implements OnInit, OnDestroy {
  private compareBetsUseCase = inject(CompareBetsByLotery);
  private breakpointObserver = inject(BreakpointObserver);
  private destroy$ = new Subject<void>();
  private notification = inject(NOTIFICATION_PORT);

  isMobile: boolean = false;
  isLoading: boolean = false;
  pageIndex: number = 0;
  pageSize: number = 25;
  totalItems: number = 0;
  overallTotal: number = 0;

  userComparisionData!: UserComparison[];
  showForm: boolean = false;
  lastFormValues!: IFormValues;

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

  async applyFilter(
    valueForms: IFormValues,
    pageIndex: number = 0,
    pageSize: number = 25
  ) {
    this.isLoading = true;
    try {
      const { result, total, overallTotal } =
        await this.compareBetsUseCase.execute(valueForms);
        
      this.userComparisionData = result;
      this.totalItems = total;
      this.pageIndex = pageIndex;
      this.pageSize = pageSize;
      this.overallTotal = overallTotal;
      this.lastFormValues = valueForms;
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
