import { Component } from '@angular/core';

@Component({
    selector: 'app-check-hits-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    standalone: true,
})
export class CheckHitsTableComponent {
    // Aquí puedes inicializar las propiedades necesarias para la tabla
    hits: any[] = [];

    constructor() {
        // Inicialización si es necesario
    }
}