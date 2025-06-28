import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Timestamp } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';

import { MaterialModule } from '../../../../shared/material/material.module';
import {
  DeactivateUserUseCase,
  DeleteUserUseCase,
  GetUsersUseCase,
} from '../../../../domain/users/use-cases';
import { UserData } from '../../../../domain/users/models/users.entity';
import { NOTIFICATION_PORT } from '../../../../shared/ports';
import { getFirebaseAuthErrorMessage } from '../../../../shared/function/getFirebaseLoginErrorMessage.function';
import { UserStateService } from '../../service/user-state.service';
import { AUTH_SESSION } from '../../../../domain/auth/ports';
import { AuthUser } from '../../../../domain/auth/models/auth-user.entity';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit, OnDestroy {
  private getUseCase = inject(GetUsersUseCase);
  private changeStatus = inject(DeactivateUserUseCase);
  private deleteUseCase = inject(DeleteUserUseCase);
  private notification = inject(NOTIFICATION_PORT);
  private breakpointObserver = inject(BreakpointObserver);
  private destroy$ = new Subject<void>();
  private userState = inject(UserStateService);
  private userSession = inject(AUTH_SESSION);
  private dialog = inject(MatDialog);

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

  currentUser!: AuthUser;
  dataSource = new MatTableDataSource<UserData>([]);
  displayedColumns: string[] = [];
  loadingIcon: boolean = false;

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

  private async refreshList() {
    this.userState.refreshList$
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (res) => {
        if (!res) return;
        await this.getUsers();
      });
  }

  async ngOnInit(): Promise<void> {
    this.currentUser = this.userSession.getUser()!;
    this.adaptarResponsive();
    await this.getUsers();
    await this.refreshList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  editUser(userData: UserData) {
    this.userState.setSelectedUser(userData);
  }

  async toggleState(userData: UserData) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: userData.state ? 'Desactivar usuario' : 'Activar usuario',
        message: userData.state
          ? '¿Estás seguro de desactivar este usuario?'
          : '¿Quieres activar este usuario?',
      },
    });

    const confirmed = await firstValueFrom(dialogRef.afterClosed());

    if (!confirmed) return;

    this.loadingIcon = true;

    try {
      const updater = {
        id: this.currentUser?.uid ?? '',
        name: this.currentUser?.name || this.currentUser?.email || '',
      };

      await this.changeStatus.execute(
        userData?.uid!,
        !userData?.state,
        Timestamp.now(),
        updater
      );

      this.notification.success(
        `Usuario ${userData?.state ? 'desactivado' : 'activado'} exitosamente`
      );

      await this.getUsers();
    } catch (error) {
      this.notification.error(getFirebaseAuthErrorMessage(error));
    } finally {
      this.loadingIcon = false;
    }
  }

  async deleteUser(userData: UserData) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar usuario',
        message: `¿Está seguro que desea eliminar al usuario: ${userData?.name}?`,
      },
    });

    const confirm = await firstValueFrom(dialogRef.afterClosed());
    if (!confirm) return;

    this.loadingIcon = true;

    try {
      await this.deleteUseCase.execute(userData?.uid!);
      this.notification.success(`Usuario eliminado exitosamente`);
      await this.getUsers();
    } catch (error) {
      this.notification.error(getFirebaseAuthErrorMessage(error));
    } finally {
      this.loadingIcon = false;
    }
  }
}
