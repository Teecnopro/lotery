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

  constructor() {
    this.getDataSource();
  }
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

  dataSource: PaymentParameterization[] = [];

  getDataSource() {
    const dataSource = [
      {
        uid: '1',
        digits: 1,
        combined: false,
        amount: 100,
        createdBy: { name: 'Samuel Suarez', id: 'user-1' },
        createdAt: new Date('12-6-2025 12:32:32').getTime(),
        updatedBy: { name: 'Samuel Suarez', id: 'user-1' },
        updatedAt: new Date('12-6-2025 12:32:32').getTime(),
      },
      {
        uid: '2',
        digits: 2,
        combined: false,
        amount: 250,
        createdBy: { name: 'Samuel Suarez', id: 'user-1' },
        createdAt: new Date('12-6-2025 12:32:32').getTime(),
        updatedBy: { name: 'Samuel Suarez', id: 'user-1' },
        updatedAt: new Date('12-6-2025 12:32:32').getTime(),
      },
      {
        uid: '3',
        digits: 3,
        combined: false,
        amount: 75,
        createdBy: { name: 'Samuel Suarez', id: 'user-1' },
        createdAt: new Date('12-6-2025 12:32:32').getTime(),
        updatedBy: { name: 'Samuel Suarez', id: 'user-1' },
        updatedAt: new Date('12-6-2025 12:32:32').getTime(),
      },
      {
        uid: '4',
        digits: 3,
        combined: true,
        amount: 300,
        createdBy: { name: 'Samuel Suarez', id: 'user-1' },
        createdAt: new Date('12-6-2025 12:32:32').getTime(),
        updatedBy: { name: 'Samuel Suarez', id: 'user-1' },
        updatedAt: new Date('12-6-2025 12:32:32').getTime(),
      },
    ];
    this.dataSource = dataSource;
  }

  editPayment(element: any) {
    this.paymentObservable?.next(element);
    // Aquí puedes implementar la lógica para editar
  }

  deletePayment(element: any) {
    this.paymentObservable?.next(element);
    // Aquí puedes implementar la lógica para eliminar
  }
}
