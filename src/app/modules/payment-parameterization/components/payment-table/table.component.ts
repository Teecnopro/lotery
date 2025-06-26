import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-payment-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class PaymentTableComponent {
  displayedColumns: string[] = ['name', 'amount', 'actions'];
  
  dataSource = [
    { id: 1, name: 'Pago 1', amount: 100 },
    { id: 2, name: 'Pago 2', amount: 250 },
    { id: 3, name: 'Pago 3', amount: 75 },
    { id: 4, name: 'Pago 4', amount: 300 }
  ];

  editPayment(element: any) {
    console.log('Editar pago:', element);
    // Aquí puedes implementar la lógica para editar
  }

  deletePayment(element: any) {
    console.log('Eliminar pago:', element);
    // Aquí puedes implementar la lógica para eliminar
  }
}