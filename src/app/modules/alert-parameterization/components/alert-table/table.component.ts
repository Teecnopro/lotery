import { Component, Input, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { Subject, Subscription } from 'rxjs';
import { AlertParameterization } from '../../../../domain/alert-parameterization/models/alert-parameterization.entity';
import { AlertParameterizationUseCase } from '../../../../domain/alert-parameterization/use-cases';
import { NOTIFICATION_PORT } from '../../../../shared/ports';
import { DatePipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, DatePipe, CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class AlertTableComponent implements OnInit {
  @Input() alertObservable: Subject<AlertParameterization> | null = null;
  @Input() updateTable: Subject<boolean> | null = null;
  private alertParameterizationUseCase = inject(AlertParameterizationUseCase);
  private notification = inject(NOTIFICATION_PORT);

  loading: boolean = false;
  dataSource: AlertParameterization[] = [];
  
  displayedColumns: string[] = [
    'value',
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

  async getDataSource() {
    this.loading = true;
    try {
      const dataSource = await this.alertParameterizationUseCase.listAlertParameterizations();
      this.dataSource = dataSource;
      this.loading = false;
    } catch (error: any) {
      console.error('Error fetching alert parameterizations:', error);
      this.notification.error(error?.message || 'Error al cargar las parametrizaciones de alerta');
      this.loading = false;
    }
  }

  editAlert(element: AlertParameterization) {
    this.alertObservable?.next(element);
  }

  async deleteAlert(element: AlertParameterization) {
    if (confirm('¿Está seguro que desea eliminar esta parametrización de alerta?')) {
      try {
        await this.alertParameterizationUseCase.deleteAlertParameterization(element.uid!);
        this.notification.success('Parametrización de alerta eliminada exitosamente');
        this.getDataSource(); // Refresh the table
      } catch (error: any) {
        console.error('Error deleting alert parameterization:', error);
        this.notification.error(error?.message || 'Error al eliminar la parametrización de alerta');
      }
    }
  }
}
