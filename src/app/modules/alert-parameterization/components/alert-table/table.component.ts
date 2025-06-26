import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-alert-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class AlertTableComponent {
  displayedColumns: string[] = ['title', 'type', 'priority', 'actions'];
  
  dataSource = [
    { id: 1, title: 'Alerta de Sistema', type: 'email', priority: 'high' },
    { id: 2, title: 'Notificación de Pago', type: 'sms', priority: 'medium' },
    { id: 3, title: 'Alerta Crítica', type: 'push', priority: 'critical' },
    { id: 4, title: 'Webhook de Actualización', type: 'webhook', priority: 'low' }
  ];

  editAlert(element: any) {
    console.log('Editar alerta:', element);
    // Aquí puedes implementar la lógica para editar
  }

  deleteAlert(element: any) {
    console.log('Eliminar alerta:', element);
    // Aquí puedes implementar la lógica para eliminar
  }
}