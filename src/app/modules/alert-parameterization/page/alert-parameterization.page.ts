import { Component } from '@angular/core';
import { AlertFormComponent } from '../components/alert-form/form.component';
import { AlertTableComponent } from '../components/alert-table/table.component';
import { Subject } from 'rxjs';
import { AlertParameterization } from '../../../domain/alert-parameterization/models/alert-parameterization.entity';

@Component({
  selector: 'app-alert-parameterization-page',
  standalone: true,
  imports: [AlertFormComponent, AlertTableComponent],
  templateUrl: './alert-parameterization.page.html',
  styleUrls: ['./alert-parameterization.page.scss'],
})
export class AlertParameterizationPageComponent {
  alertObservable: Subject<AlertParameterization> = new Subject<AlertParameterization>();
  constructor() {
    this.alertObservable.next({
      uid: "1",
    });
  }
}