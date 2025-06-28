import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { MaterialModule } from '../../../../shared/material/material.module';
import { GetUsersUseCase } from '../../../../domain/users/use-cases';
import { UserData } from '../../../../domain/users/models/users.entity';
import { NOTIFICATION_PORT } from '../../../../shared/ports';
import { getFirebaseAuthErrorMessage } from '../../../../shared/function/getFirebaseLoginErrorMessage.function';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit, OnDestroy {
  private getUseCase = inject(GetUsersUseCase);
  private notification = inject(NOTIFICATION_PORT);
  private breakpointObserver = inject(BreakpointObserver);
  private destroy$ = new Subject<void>();

  private fullColumns = [
    'name',
    'email',
    'state',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'actions',
  ];

  private mobileColumns = ['name', 'email', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<UserData>([]);
  displayedColumns: string[] = [];

  private async getUsers() {
    try {
      const rawsUsers: UserData[] = await this.getUseCase.execute();
      this.dataSource.data = rawsUsers;
    } catch (error) {
      this.notification.error(getFirebaseAuthErrorMessage(error));
    }
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

  async ngOnInit(): Promise<void> {
    this.adaptarResponsive();
    await this.getUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  editUser(userData: UserData) {}

  deleteUser(userData: UserData) {}
}
