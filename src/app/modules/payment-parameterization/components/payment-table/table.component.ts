import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-payment-table',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class PaymentTableComponent {
  displayedColumns: string[] = ['name', 'amount'];
  
  dataSource = [
    { id: 1, name: 'Pago 1', amount: 100, status: 'Completado' },
    { id: 2, name: 'Pago 2', amount: 250, status: 'Pendiente' },
    { id: 3, name: 'Pago 3', amount: 75, status: 'Fallido' }
  ];
}