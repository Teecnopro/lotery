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
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';

import { MaterialModule } from '../../../../../shared/material/material.module';
import { UserComparison } from '../../../../../domain/reports/models/vendor-comparison.entity';

@Component({
  selector: 'app-list-by-users-bets',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './list-by-users-bets.component.html',
  styleUrl: './list-by-users-bets.component.scss',
})
export class ListByUsersBetsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() userComparisionData!: UserComparison[];
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
    'creatorName',
    'lotteryName',
    'countLottery',
    'total',
  ];
  private mobileColumns: string[] = ['creatorName', 'total'];

  dataSource = new MatTableDataSource<UserComparison>([]);
  displayedColumns: string[] = [];

  ngOnInit(): void {
    this.adaptarResponsive();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['userComparisionData'];
    if (change?.currentValue) {
      this.handleUserComparisonChange(change?.currentValue);
    }
  }

  private handleUserComparisonChange(data: UserComparison[]) {
    this.dataSource.data = data;
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

  onPageChange(event: PageEvent) {
    this.changePage.emit({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }
}
