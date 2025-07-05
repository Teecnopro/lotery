import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/material/material.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthUser } from '../../../../domain/auth/models/auth-user.entity';

@Component({
    selector: 'app-logbook-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatCardModule,
    ],
    standalone: true
})
export class LogbookFormComponent implements OnInit {
    textButton: string = 'Filtrar';
    logBookFilter = {};
    today: Date = new Date();
    users: AuthUser[] = []
    selectedUser: AuthUser | null = null;
    selectedActionType: string | null = null;
    selectedModule: string | null = null;
    actionTypes: string[] = ['Creación', 'Actualización', 'Eliminación'];
    modules: string[] = ['Usuarios', 'Alertas', 'Pagos', 'Apuestas', 'Vendedores', 'Reportes', 'Bitácora'];
    dateRange: { start: Date | null, end: Date | null } = { start: null, end: null };
    dateRangeStart: Date | null = null;
    dateRangeEnd: Date | null = null;

    constructor() { }

    ngOnInit(): void {
        // Inicialización del componente
    }

    onSubmit(form: NgForm) {
        // Lógica para manejar el envío del formulario
        console.log('Formulario enviado');
    }

    limpiarFormulario(form: NgForm) {
        // Lógica para limpiar el formulario
        form.resetForm();
        this.logBookFilter = {};
        console.log('Formulario limpiado');
    }

}