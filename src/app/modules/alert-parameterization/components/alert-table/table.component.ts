import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-alert-table',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class AlertTableComponent {
  displayedColumns: string[] = ['title', 'type', 'priority', 'status'];
  
  dataSource = [
    { id: 1, title: 'Alerta de Sistema', type: 'email', priority: 'high', status: 'Activa' },
    { id: 2, title: 'Notificación de Pago', type: 'sms', priority: 'medium', status: 'Pendiente' },
    { id: 3, title: 'Alerta Crítica', type: 'push', priority: 'critical', status: 'Pausada' },
    { id: 4, title: 'Webhook de Actualización', type: 'webhook', priority: 'low', status: 'Activa' }
  ];
}