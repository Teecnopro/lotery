import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { AlertParameterizationUseCase } from '../../../../domain/alert-parameterization/use-cases';
import { PaymentParameterizationUseCase } from '../../../../domain/payment-parameterization/use-cases';
import { MaterialModule } from '../../../../shared/material/material.module';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginFormComponent, CommonModule, MaterialModule],
  template: `
    <div class="login-page-container">
      <mat-progress-bar
        *ngIf="loading"
        mode="indeterminate"
        color="primary"
        class="progress-bar"
      ></mat-progress-bar>

      <app-login-form
        [disabled]="loading"
        (loginSuccess)="onLoginSuccess()"
        (recoverPassword)="onRecoverPassword()"
      ></app-login-form>
    </div>
  `,
})
export class LoginPageComponent {
  private router = inject(Router);
  alertParameterizationUseCase = inject(AlertParameterizationUseCase);
  paymentParameterizationUseCase = inject(PaymentParameterizationUseCase);
  loading: boolean = false;

  async onLoginSuccess() {
    this.loading = true;

    await Promise.all([this.getAlertDataSource(), this.getPaymentDataSource()]);

    this.router.navigate(['/dashboard']);
  }

  onRecoverPassword() {
    this.router.navigate(['/auth/recover-password']);
  }

  async getAlertDataSource() {
    const alertDataSource =
      await this.alertParameterizationUseCase.listAlertParameterizations();
    localStorage.removeItem('alertDataSource');
    localStorage.setItem(
      'alertDataSource',
      JSON.stringify(
        alertDataSource.map((alert) => {
          delete alert.uid;
          delete alert.id;
          return alert;
        })
      )
    );
  }

  async getPaymentDataSource() {
    const paymentDataSource =
      await this.paymentParameterizationUseCase.listPaymentParameterizations();
    localStorage.removeItem('paymentDataSource');
    localStorage.setItem(
      'paymentDataSource',
      JSON.stringify(
        paymentDataSource.map((payment) => {
          delete payment.uid;
          return payment;
        })
      )
    );
  }
}
