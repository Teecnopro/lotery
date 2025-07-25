import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { VendorComparison } from '../../../../../domain/reports/models/vendor-comparison.entity';
import { MaterialModule } from '../../../../../shared/material/material.module';

@Component({
  selector: 'app-list-compare-bets',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './list-compare-bets.component.html',
  styleUrl: './list-compare-bets.component.scss',
})
export class ListCompareBetsComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() vendorComparisionData!: {
    vendorComparision: VendorComparison[];
    month1Label: string;
    month2Label: string;
  };
  @Input() loading: boolean = false;
  @Input() total: number = 0;
  @Input() pageIndex: number = 0;
  @Input() pageSize: number = 25;
  @Input() overallTotal: number = 0;

  @Output() changePage = new EventEmitter<{
    pageIndex: number;
    pageSize: number;
  }>();

  private breakpointObserver = inject(BreakpointObserver);
  private destroy$ = new Subject<void>();

  private fullColumns: string[] = [
    'vendorName',
    'valueMonth1',
    'valueMonth2',
    'total',
    'variation',
  ];

  private mobileColumns: string[] = ['valueMonth1', 'valueMonth2', 'total'];

  dataSource = new MatTableDataSource<VendorComparison>([]);
  displayedColumns: string[] = [];
  nameMonth1: string = 'Mes 1';
  nameMonth2: string = 'Mes 2';

  ngOnInit(): void {
    this.adaptarResponsive();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['vendorComparisionData'];
    if (change?.currentValue?.vendorComparision) {
      this.handleVendorComparisonChange(change.currentValue.vendorComparision);
      this.nameMonth1 = change?.currentValue?.month1Label;
      this.nameMonth2 = change?.currentValue?.month2Label;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private adaptarResponsive() {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.displayedColumns = result?.matches
          ? this.mobileColumns
          : this.fullColumns;
      });
  }

  private handleVendorComparisonChange(data: VendorComparison[]) {
    this.dataSource.data = data;
  }

  onPageChange(event: PageEvent) {
    this.changePage.emit({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }
}
