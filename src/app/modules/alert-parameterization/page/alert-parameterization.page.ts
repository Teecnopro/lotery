import { Component } from '@angular/core';
import { AlertFormComponent } from '../components/alert-form/form.component';
import { AlertTableComponent } from '../components/alert-table/table.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-alert-parameterization-page',
  standalone: true,
  imports: [AlertFormComponent, AlertTableComponent],
  templateUrl: './alert-parameterization.page.html',
  styleUrls: ['./alert-parameterization.page.scss'],
})
export class AlertParameterizationPageComponent {
  alertObservable: Subject<any> = new Subject<any>();
  constructor() {
    this.alertObservable.next({
      id: 1,
    });
  }
}