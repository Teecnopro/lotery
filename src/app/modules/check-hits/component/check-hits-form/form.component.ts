import { Component, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material/material.module';
import { lotteries } from '../../../../shared/const'; // Adjust the import path as necessary

interface CheckData {
    date: string;
    lottery: string;
    number: string;
}

@Component({
    selector: 'app-check-hits-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    standalone: true,
    imports: [
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        FormsModule,
        CommonModule,
        MaterialModule
    ]
})
export class CheckHitsFormComponent {
    @Output() searchResults = new EventEmitter<any>();

    checkData: CheckData = {
        date: '',
        lottery: '',
        number: ''
    };

    loading = false;
    lotteries = lotteries; // Assuming lotteries is an array of lottery objects

    constructor(private ChangeDetectorRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.checkData.lottery = lotteries[0]._id;
        this.ChangeDetectorRef.detectChanges();
    }

    onSubmit(form: NgForm): void {
        if (form.valid) {
            this.loading = true;
        }
    }

    limpiarFormulario(form: NgForm): void {
        form.resetForm();
        this.checkData = {
            date: '',
            lottery: '',
            number: ''
        };
        // No emitir array vacío, dejar que la tabla muestre sus datos por defecto
    }
}