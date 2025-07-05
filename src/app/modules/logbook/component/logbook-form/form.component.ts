import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/material/material.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthUser } from '../../../../domain/auth/models/auth-user.entity';
import { Subject, filter } from 'rxjs';
import { USER_SERVICE } from '../../../../domain/users/ports';
import { ACTIONS, ACTIONS_LOGBOOK } from '../../../../shared/const/actions';
import { MODULES, NAME_MODULES } from '../../../../shared/const/modules';

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
    @Input() queries: Subject<{ [key: string]: string | number }> = new Subject<{ [key: string]: string | number }>()
    private user = inject(USER_SERVICE);
    textButton: string = 'Filtrar';
    logBookFilter = {};
    today: Date = new Date();
    users: AuthUser[] = [];
    selectedUser: string | null = null;
    selectedaction: string | null = null;
    selectedModule: string | null = null;
    dateRange: { start: Date | null, end: Date | null } = { start: null, end: null };
    dateRangeStart: string | null = null;
    dateRangeEnd: string | null = null;
    modules: { value: string; label: string }[] = [];
    actions: { value: string; label: string }[] = [];

    constructor() { }

    async ngOnInit(): Promise<void> {
        // Inicialización del componente
        this.users = await this.user.getAll()
        Object.values(MODULES).forEach((module) => {
            this.modules.push({ value: module, label: NAME_MODULES[module] });
        });
        Object.values(ACTIONS).forEach((action) => {
            this.actions.push({ value: action, label: ACTIONS_LOGBOOK[action] });
        });
    }

    onSubmit(form: NgForm) {
        const filter = {
                "user.uid": form.value.user ? form.value.user ?? '' : '',
                "action": form.value.action ?? '',
                "module": form.value.module ?? '',
                "dateRangeStart": new Date(form.value.startDate).setHours(0, 0, 0, 0).valueOf() ?? '',
                "dateRangeEnd": new Date(form.value.endDate).setHours(23, 59, 59, 999).valueOf() ?? ''
            }
        this.queries.next(filter);
    }

    limpiarFormulario(form: NgForm) {
        // Lógica para limpiar el formulario
        form.resetForm();
        this.logBookFilter = {};
    }

}