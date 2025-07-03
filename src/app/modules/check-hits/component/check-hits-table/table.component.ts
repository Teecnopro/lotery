import { Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

interface CheckResult {
  numero: string;
  vendedor: string;
  combinado: string;
  valor: number;
  premio: number;
}

@Component({
    selector: 'app-check-hits-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    standalone: true,
    imports: [
      MatTableModule,
      MatPaginatorModule,
      CommonModule
    ]
})
export class CheckHitsTableComponent {
    private _dataSource: CheckResult[] = [];
    private defaultData: CheckResult[] = [
      {
        numero: '1234',
        vendedor: 'Juan Pérez',
        combinado: 'Sí',
        valor: 5000,
        premio: 25000
      },
      {
        numero: '5678',
        vendedor: 'María García',
        combinado: 'No',
        valor: 2000,
        premio: 0
      },
      {
        numero: '9012',
        vendedor: 'Carlos López',
        combinado: 'Sí',
        valor: 3000,
        premio: 15000
      },
      {
        numero: '3456',
        vendedor: 'Ana Martínez',
        combinado: 'No',
        valor: 1000,
        premio: 8000
      },
      {
        numero: '7890',
        vendedor: 'Luis Rodríguez',
        combinado: 'Sí',
        valor: 4000,
        premio: 0
      },
      {
        numero: '1111',
        vendedor: 'Sofia González',
        combinado: 'No',
        valor: 1500,
        premio: 12000
      },
      {
        numero: '2222',
        vendedor: 'Miguel Torres',
        combinado: 'Sí',
        valor: 6000,
        premio: 30000
      },
      {
        numero: '3333',
        vendedor: 'Elena Vargas',
        combinado: 'No',
        valor: 2500,
        premio: 0
      }
    ];

    @Input() 
    set dataSource(value: CheckResult[]) {
        this._dataSource = value && value.length > 0 ? value : this.defaultData;
    }
    
    get dataSource(): CheckResult[] {
        return this._dataSource;
    }
    
    @Input() loading = false;
    
    displayedColumns: string[] = ['numero', 'vendedor', 'combinado', 'valor', 'premio'];
    
    constructor() {
        this._dataSource = this.defaultData;
    }
}