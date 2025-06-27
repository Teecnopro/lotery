import { Component, Input, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class AlertTableComponent {
  @Input() alertObservable: any;

  displayedColumns: string[] = [
    'value',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'actions',
  ];

  dataSource = [
    {
      id: 1,
      value: 10000,
      createdBy: 'Samuel Suarez',
      createdAt: '12-6-2025 12:32:32',
      updatedBy: 'Samuel Suarez',
      updatedAt: '12-6-2025 12:32:32',
    },
  ];

  editAlert(element: any) {
    this.alertObservable.next(element);
    // Aquí puedes implementar la lógica para editar
  }

  deleteAlert(element: any) {
    this.alertObservable.next(element);
    // Aquí puedes implementar la lógica para eliminar
  }
}
