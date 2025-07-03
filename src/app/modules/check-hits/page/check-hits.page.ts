import { Component, OnInit } from '@angular/core';
import { CheckHitsFormComponent } from '../component/check-hits-form/form.component';
import { CheckHitsTableComponent } from '../component/check-hits-table/table.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material/material.module';

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
    searchResults: CheckResult[] = [];
    loading = false;
    showForm = false;
    isMobile: boolean = false;

    constructor() { }

    ngOnInit(): void {
        // Inicialización del componente
    }
    
    onSearchResults(results: CheckResult[]): void {
        this.searchResults = results;
    }

    toggleForm(): void {
        this.showForm = !this.showForm;
    }
}