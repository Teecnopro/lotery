import { Component, Input, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { Subject, Subscription } from 'rxjs';
import { AlertParameterization } from '../../../../domain/alert-parameterization/models/alert-parameterization.entity';

@Component({
  selector: 'app-alert-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class AlertTableComponent {
  @Input() alertObservable: Subject<AlertParameterization> | null = null;

  displayedColumns: string[] = [
    'value',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'actions',
  ];

  dataSource: AlertParameterization[] = [];

  constructor() {
    this.getDataSource();
  }
  getDataSource() {
    // Aquí puedes implementar la lógica para obtener los datos de la fuente de datos
    this.dataSource = [
      {
        uid: '1',
        value: 10000,
        createdBy: { name: 'Samuel Suarez', uid: 'user-1' },
        createdAt: new Date('12-6-2025 12:32:32').getTime(),
        updatedBy: { name: 'Samuel Suarez', uid: 'user-1' },
        updatedAt: new Date('12-6-2025 12:32:32').getTime(),
      },
      {
        uid: '2',
        value: 25000,
        createdBy: { name: 'Samuel Suarez', uid: 'user-1' },
        createdAt: new Date('12-6-2025 12:32:32').getTime(),
        updatedBy: { name: 'Samuel Suarez', uid: 'user-1' },
        updatedAt: new Date('12-6-2025 12:32:32').getTime(),
      },
      {
        uid: '3',
        value: 7500,
        createdBy: { name: 'Samuel Suarez', uid: 'user-1' },
        createdAt: new Date('12-6-2025 12:32:32').getTime(),
        updatedBy: { name: 'Samuel Suarez', uid: 'user-1' },
        updatedAt: new Date('12-6-2025 12:32:32').getTime(),
      },
    ];
  }

  editAlert(element: any) {
    this.alertObservable?.next(element);
    // Aquí puedes implementar la lógica para editar
  }

  deleteAlert(element: any) {
    this.alertObservable?.next(element);
    // Aquí puedes implementar la lógica para eliminar
  }
}
