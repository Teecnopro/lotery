import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { PaymentParameterization } from '../../../../domain/payment-parameterization/models/payment-parameterization.entity';
import { firstValueFrom, Subject, Subscription } from 'rxjs';
import { PaymentParameterizationUseCase } from '../../../../domain/payment-parameterization/use-cases';
import { NOTIFICATION_PORT } from '../../../../shared/ports';
import { DatePipe, CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-payment-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, DatePipe, CommonModule, MatIconModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class PaymentTableComponent implements OnInit {
  @Input() paymentObservable: Subject<PaymentParameterization> | null = null;
  @Input() updateTable: Subject<boolean> | null = null;
  @Input() showFormObservable: Subject<boolean> | null = null;
  private paymentParameterizationUseCase = inject(PaymentParameterizationUseCase);
  private notification = inject(NOTIFICATION_PORT);
  private dialog = inject(MatDialog);
  private updateSubscription?: Subscription;

  loading: boolean = false;
  dataSource: PaymentParameterization[] = [];

  displayedColumns: string[] = [
    'digits',
    'amount',
    'combined',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'actions',
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getDataSource();
    if (this.updateTable) {
      this.updateSubscription = this.updateTable.subscribe((value) => {
        this.getDataSource();
      });
    }
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
    // No hacer unsubscribe de los Subjects ya que son manejados por el componente padre
  }

  async getDataSource() {
    this.loading = true;
    try {
      const dataSource = await this.paymentParameterizationUseCase.listPaymentParameterizations();
      this.dataSource = dataSource;
    } catch (error: any) {
      console.error('Error fetching payment parameterizations:', error);
      this.notification.error(error?.message || 'Error al cargar las parametrizaciones de pago');
    } finally {
      this.loading = false;
    }
  }

  editPayment(element: PaymentParameterization) {
    // Remover foco del botón antes de la acción
    if (document.activeElement && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    this.showFormObservable?.next(true);
    setTimeout(() => {
      this.paymentObservable?.next(element);
    }, 100);
  }

  async deletePayment(element: PaymentParameterization) {
    // Remover foco del botón antes de abrir el dialog
    if (document.activeElement && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar parametrización de pago',
        message: '¿Está seguro que desea eliminar esta parametrización de pago?',
      },
    });
    const confirmed = await firstValueFrom(dialogRef.afterClosed());
    if (confirmed) {
      try {
        await this.paymentParameterizationUseCase.deletePaymentParameterization(element.uid!);
        this.notification.success('Parametrización de pago eliminada exitosamente');
        await this.getDataSource(); // Refresh the table
      } catch (error: any) {
        console.error('Error deleting payment parameterization:', error);
        this.notification.error(error?.message || 'Error al eliminar la parametrización de pago');
      }
    }
  }
}
