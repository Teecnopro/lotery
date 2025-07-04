import { Component, OnInit } from '@angular/core';
import { CheckHitsFormComponent } from '../component/check-hits-form/form.component';
import { CheckHitsTableComponent } from '../component/check-hits-table/table.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material/material.module';
import { Subject } from 'rxjs';

interface CheckResult {
  numero: string;
  vendedor: string;
  combinado: string;
  valor: number;
  premio: number;
}

@Component({
    selector: 'app-check-hits',
    templateUrl: './check-hits.page.html',
    styleUrls: ['./check-hits.page.scss'],
    imports: [CheckHitsFormComponent, CheckHitsTableComponent, CommonModule, MaterialModule],
    standalone: true,
})
export class CheckHitsPage implements OnInit {
    queries: Subject<{ [key: string]: string }[]> = new Subject<{ [key: string]: string }[]>();
    searchResults: CheckResult[] = [];
    loading = false;
    showForm = false;
    isMobile: boolean = false;

    constructor() { }

    ngOnInit(): void {
        // Inicialización del componente
    }

    ngOnDestroy(): void {
        this.queries.complete();
    }
    
    onSearchResults(results: CheckResult[]): void {
        this.searchResults = results;
    }

    toggleForm(): void {
        this.showForm = !this.showForm;
    }
}