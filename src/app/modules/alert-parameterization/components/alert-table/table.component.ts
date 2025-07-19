import { Component, Input, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { firstValueFrom, map, Subject, Subscription, takeUntil } from 'rxjs';
import { AlertParameterization } from '../../../../domain/alert-parameterization/models/alert-parameterization.entity';
import { AlertParameterizationUseCase } from '../../../../domain/alert-parameterization/use-cases';
import { NOTIFICATION_PORT } from '../../../../shared/ports';
import { DatePipe, CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { LOG_BOOK_SERVICE } from '../../../../domain/logBook/ports';
import { ACTIONS } from '../../../../shared/const/actions';
import { AuthUser } from '../../../../domain/auth/models/auth-user.entity';
import { AUTH_SESSION } from '../../../../domain/auth/ports';
import { MODULES } from '../../../../shared/const/modules';

@Component({
  selector: 'app-alert-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, DatePipe, CommonModule, MatIconModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class AlertTableComponent implements OnInit {
  @Input() alertObservable: Subject<AlertParameterization> | null = null;
  @Input() updateTable: Subject<boolean> | null = null;
  @Input() showFormObservable: Subject<boolean> | null = null;
  private alertParameterizationUseCase = inject(AlertParameterizationUseCase);
  private logBook = inject(LOG_BOOK_SERVICE);
  private notification = inject(NOTIFICATION_PORT);
  private dialog = inject(MatDialog);
  user = inject(AUTH_SESSION);
  loading: boolean = false;
  dataSource: AlertParameterization[] = [];
  isMobile: boolean = false;
  displayedColumns: string[] = [
    'digits',
    'value',
    'description',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'actions',
  ];

  ngOnInit() {
    this.getDataSource();
    this.updateTable?.subscribe(() => {
      this.getDataSource();
    });
  }

  ngOnDestroy() {
    this.alertObservable?.complete();
    this.updateTable?.complete();
    this.showFormObservable?.complete();
  }

  async getDataSource() {
    this.loading = true;
    try {
      const dataSource = await this.alertParameterizationUseCase.listAlertParameterizations();
      this.dataSource = dataSource;
      if (localStorage.getItem('alertDataSource')) {
        localStorage.removeItem('alertDataSource');
        if (dataSource.length > 0) {
          localStorage.setItem('alertDataSource', JSON.stringify(
            dataSource
          ));
        }
      }
      this.loading = false;
    } catch (error: any) {
      console.error('Error fetching alert parameterizations:', error);
      this.notification.error(error?.message || 'Error al cargar las parametrizaciones de alerta');
      this.loading = false;
    }
  }

  editAlert(element: AlertParameterization) {
    this.showFormObservable?.next(true);
    setTimeout(() => {
      this.alertObservable?.next(element);
    }, 100);
  }

  async deleteAlert(element: AlertParameterization) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar parametrización de alerta',
        message: '¿Está seguro que desea eliminar esta parametrización de alerta?'
      },
    });
    const confirmed = await firstValueFrom(dialogRef.afterClosed());
    if (confirmed) {
      try {
        await this.alertParameterizationUseCase.deleteAlertParameterization(element.uid!).then(async () => {
          await this.logBook.createLogBook({
            action: ACTIONS.DELETE,
            user: this.user.getUser() as AuthUser,
            date: Date.now().valueOf(),
            module: MODULES.ALERT_PARAMETERIZATION,
            description: `Se eliminó la parametrización de alerta con id ${element.uid}`,
          });
        });
        this.notification.success('Parametrización de alerta eliminada exitosamente');
        this.getDataSource(); // Refresh the table
      } catch (error: any) {
        console.error('Error deleting alert parameterization:', error);
        this.notification.error(error?.message || 'Error al eliminar la parametrización de alerta');
      }
    }
  }
}
