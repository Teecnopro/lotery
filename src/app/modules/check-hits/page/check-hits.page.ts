import { Component, OnInit } from '@angular/core';
import { CheckHitsFormComponent } from '../component/check-hits-form/form.component';
import { CheckHitsTableComponent } from '../component/check-hits-table/table.component';

@Component({
    selector: 'app-check-hits',
    templateUrl: './check-hits.page.html',
    styleUrls: ['./check-hits.page.scss'],
    imports: [CheckHitsFormComponent, CheckHitsTableComponent],
    standalone: true,
})
export class CheckHitsPage implements OnInit {

    constructor() { }

    ngOnInit(): void {
        // Inicialización del componente
    }

}