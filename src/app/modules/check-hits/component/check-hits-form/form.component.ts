import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-check-hits-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    standalone: true,
})
export class CheckHitsFormComponent {
    checkHitsForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.checkHitsForm = this.fb.group({
            // Agrega aquí los controles del formulario, por ejemplo:
            // ticketNumber: [''],
            // date: ['']
        });
    }

    onSubmit(): void {
        if (this.checkHitsForm.valid) {
            // Lógica para manejar el envío del formulario
            console.log(this.checkHitsForm.value);
        }
    }
}