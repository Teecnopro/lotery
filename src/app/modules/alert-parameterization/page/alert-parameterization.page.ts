import { Component } from '@angular/core';
import { AlertFormComponent } from '../components/alert-form/form.component';
import { AlertTableComponent } from '../components/alert-table/table.component';
import { Subject } from 'rxjs';
import { AlertParameterization } from '../../../domain/alert-parameterization/models/alert-parameterization.entity';
import { CommonModule } from '@angular/common';
import { ALERT_PARAMETERIZATION_SERVICE } from '../../../domain/alert-parameterization/ports';
import { FirebaseAlertParameterizationAdapter } from '../../../infrastructure/alert-parameterization/alert-parameterization.adapter';
import { AlertParameterizationUseCase } from '../../../domain/alert-parameterization/use-cases';
import { NOTIFICATION_PORT } from '../../../shared/ports';
import { MaterialNotificationAdapter } from '../../../shared/infrastructure/matsnackbar-notification.adapter';
import { MaterialModule } from '../../../shared/material/material.module';
import { LogBookUseCases } from '../../../domain/logBook/use-cases/logBook.usecases';
import { LOG_BOOK_SERVICE } from '../../../domain/logBook/ports';
import { LogBookAdapter } from '../../../infrastructure/logBook/logBook.adapter';

@Component({
  selector: 'app-alert-parameterization-page',
  standalone: true,
  imports: [AlertFormComponent, AlertTableComponent, CommonModule, MaterialModule],
  providers: [
    {
      provide: ALERT_PARAMETERIZATION_SERVICE,
      useClass: FirebaseAlertParameterizationAdapter,
    },
    {
      provide: NOTIFICATION_PORT,
      useClass: MaterialNotificationAdapter,
    },
    {
      provide: LOG_BOOK_SERVICE,
      useClass: LogBookAdapter
    },
    LogBookUseCases,
    AlertParameterizationUseCase,
    LogBookUseCases,
  ],
  templateUrl: './alert-parameterization.page.html',
  styleUrls: ['./alert-parameterization.page.scss'],
})
export class AlertParameterizationPageComponent {
  alertObservable: Subject<AlertParameterization> = new Subject<AlertParameterization>();
  updateTable: Subject<boolean> = new Subject<boolean>();
  showFormObservable: Subject<boolean> = new Subject<boolean>();
  showForm: boolean = false;
  isMobile: boolean = false;

  ngOnInit() {
    this.showFormObservable.next(false);
    this.showFormObservable.subscribe((editing) => {
      this.showForm = editing;
    });
  }

  ngOnDestroy() {
    this.alertObservable.complete();
    this.updateTable.complete();
    this.showFormObservable.complete();
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }
}