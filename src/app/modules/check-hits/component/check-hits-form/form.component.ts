import { Component, EventEmitter, Output, ChangeDetectorRef, Input, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material/material.module';
import { lotteries } from '../../../../shared/const'; // Adjust the import path as necessary
import { Subject } from 'rxjs';
import { NOTIFICATION_PORT } from '../../../../shared/ports';

interface CheckData {
    date: string;
    lottery: string;
    lotteryNumber: string;
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
    @Input() queries: Subject<{ [key: string]: string }> = new Subject<{ [key: string]: string }>();

    private notification = inject(NOTIFICATION_PORT);
    
    checkData: CheckData = {
        date: new Date(Date.now() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0], // Default to today's local date
        lottery: '',
        lotteryNumber: ''
    };

    loading = false;
    lotteries = lotteries; // Assuming lotteries is an array of lottery objects

    constructor(private ChangeDetectorRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.checkData.lottery = lotteries[0]._id;
        this.ChangeDetectorRef.detectChanges();
    }

    onSubmit(form: NgForm): void {
        if (!form.valid) {
            this.notification.error('Por favor, complete todos los campos requeridos');
            return;
        }
        if (form.valid) {
            const query: { [key: string]: any } = {
                "date": form.value.date,
                "lottery.id": form.value.lottery,
                "lotteryNumber": form.value.lotteryNumber
            };
            this.queries.next(query);
        }
    }

    limpiarFormulario(form: NgForm): void {
        form.resetForm();
        this.checkData = {
            date: '',
            lottery: '',
            lotteryNumber: ''
        };
        this.queries.next({});
    }
}