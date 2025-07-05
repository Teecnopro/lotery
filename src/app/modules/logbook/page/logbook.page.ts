import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../shared/material/material.module';
import { CommonModule } from '@angular/common';
import { LogbookFormComponent } from '../component/logbook-form/form.component';
import { LogbookTableComponent } from '../component/logbook-table/table.component';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-page',
    templateUrl: './logbook.page.html',
    styleUrls: ['./logbook.page.scss'],
    standalone: true,
    imports: [LogbookTableComponent, LogbookFormComponent, CommonModule, MaterialModule]
})
export class LogBookPageComponent implements OnInit {
    
    queries: Subject<{ [key: string]: string }[]> = new Subject<{ [key: string]: string }[]>();
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