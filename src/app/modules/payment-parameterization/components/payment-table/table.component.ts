import { Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { PaymentParameterization } from '../../../../domain/payment-parameterization/models/payment-parameterization.entity';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-payment-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class PaymentTableComponent {
  @Input() paymentObservable: Subject<PaymentParameterization> | null = null;
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

  dataSource = [
    {
      uid: 1,
      digits: 1,
      combined: false,
      amount: 100,
      createdBy: 'Samuel Suarez',
      createdAt: '12-6-2025 12:32:32',
      updatedBy: 'Samuel Suarez',
      updatedAt: '12-6-2025 12:32:32',
    },
    {
      uid: 2,
      digits: 2,
      combined: false,
      amount: 250,
      createdBy: 'Samuel Suarez',
      createdAt: '12-6-2025 12:32:32',
      updatedBy: 'Samuel Suarez',
      updatedAt: '12-6-2025 12:32:32',
    },
    {
      uid: 3,
      digits: 3,
      combined: false,
      amount: 75,
      createdBy: 'Samuel Suarez',
      createdAt: '12-6-2025 12:32:32',
      updatedBy: 'Samuel Suarez',
      updatedAt: '12-6-2025 12:32:32',
    },
    {
      uid: 4,
      digits: 3,
      combined: true,
      amount: 300,
      createdBy: 'Samuel Suarez',
      createdAt: '12-6-2025 12:32:32',
      updatedBy: 'Samuel Suarez',
      updatedAt: '12-6-2025 12:32:32',
    },
  ];

  editPayment(element: any) {
    this.paymentObservable?.next(element);
    // Aquí puedes implementar la lógica para editar
  }

  deletePayment(element: any) {
    this.paymentObservable?.next(element);
    // Aquí puedes implementar la lógica para eliminar
  }
}
