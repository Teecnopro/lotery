import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../shared/material/material.module';
import { CommonModule } from '@angular/common';
import { LogbookFormComponent } from '../component/logbook-form/form.component';
import { LogbookTableComponent } from '../component/logbook-table/table.component';
import { Subject } from 'rxjs';
import { LOG_BOOK_SERVICE } from '../../../domain/logBook/ports';
import { LogBookAdapter } from '../../../infrastructure/logBook/logBook.adapter';
import { LogBookUseCases } from '../../../domain/logBook/use-cases/logBook.usecases';

@Component({
    selector: 'app-page',
    templateUrl: './logbook.page.html',
    styleUrls: ['./logbook.page.scss'],
    standalone: true,
    imports: [LogbookTableComponent, LogbookFormComponent, CommonModule, MaterialModule],
    providers: [
        {
            provide: LOG_BOOK_SERVICE,
            useClass: LogBookAdapter
        },
        LogBookUseCases
    ]
})
export class LogBookPageComponent implements OnInit {
    
    queries: Subject<{ [key: string]: string | number }> = new Subject<{ [key: string]: string | number }>();
    showForm: boolean = false;
    isMobile: boolean = false;

    constructor() { }

    ngOnInit(): void {
        // Inicialización del componente
    }

    toggleForm() {
        this.showForm = !this.showForm;
    }

}