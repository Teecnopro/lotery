import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';

import { FormsImportModule } from '../../forms/forms-import.module';
import { MaterialModule } from '../../material/material.module';
import { IFormValues } from '../../../modules/reports/interface/IReports.interface';
import { monthRangeValidator } from '../../../modules/reports/components/compare-bets/validate/monthRangeValidator';
import { MONTHS } from '../../../modules/reports/const/month';

@Component({
  selector: 'app-form-compare-bets',
  standalone: true,
  imports: [FormsImportModule, MaterialModule],
  templateUrl: './form-compare-bets.component.html',
  styleUrl: './form-compare-bets.component.scss',
})
export class FormCompareBetsComponent implements OnInit, OnDestroy {
  @Input() loading: boolean = false;

  @Output() valuesForm = new EventEmitter<IFormValues>();

  private fb = inject(FormBuilder);
  private breakpointObserver = inject(BreakpointObserver);
  private destroy$ = new Subject<void>();

  isMobile: boolean = false;
  currentDate: Date = new Date();
  currentMonth: number = this.currentDate.getMonth() + 1;
  currentYear: number = this.currentDate.getFullYear();
  previousMonth: number = this.currentMonth === 1 ? 12 : this.currentMonth - 1;

  form = this.fb.group(
    {
      year: [this.currentYear, Validators.required],
      month1: [this.previousMonth, Validators.required],
      month2: [this.currentMonth, Validators.required],
    },
    { validators: monthRangeValidator }
  );

  readonly months = MONTHS;

  ngOnInit(): void {
    this.configResponsive();
    this.emitForFather();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private configResponsive() {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.isMobile = result?.matches;
      });
  }

  private emitValues() {
    const formValues = this.form.value;
    this.valuesForm.emit(formValues);
  }

  emitForFather() {
    if (this.form.valid) {
      this.emitValues();
    }
  }
}
