import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FirebaseAlertParameterizationAdapter } from '../../infrastructure/alert-parameterization/alert-parameterization.adapter';
import { ALERT_PARAMETERIZATION_SERVICE } from '../../domain/alert-parameterization/ports';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: ALERT_PARAMETERIZATION_SERVICE,
      useClass: FirebaseAlertParameterizationAdapter,
    },
  ],
})
export class AlertParameterizationModule {
  
}
