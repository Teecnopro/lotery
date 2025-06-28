import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { AlertParameterizationUseCase } from '../../../../domain/alert-parameterization/use-cases';
import { PaymentParameterizationUseCase } from '../../../../domain/payment-parameterization/use-cases';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginFormComponent],
  template: `
    <app-login-form
      (loginSuccess)="onLoginSuccess()"
      (recoverPassword)="onRecoverPassword()"
    ></app-login-form>
  `,
})
export class LoginPageComponent {
  private router = inject(Router);
  alertParameterizationUseCase = inject(AlertParameterizationUseCase);
  paymentParameterizationUseCase = inject(PaymentParameterizationUseCase);

  async onLoginSuccess() {
    await this.getAlertDataSource();
    await this.getPaymentDataSource();
    this.router.navigate(['/dashboard']);
  }

  onRecoverPassword() {
    this.router.navigate(['/auth/recover-password']);
  }

  async getAlertDataSource() {
    const alertDataSource = await this.alertParameterizationUseCase.listAlertParameterizations();
    localStorage.removeItem('alertDataSource');
    localStorage.setItem('alertDataSource', JSON.stringify(alertDataSource.map(alert => {
      delete alert.uid;
      delete alert.id;
      return alert;
    })));
  }

  async getPaymentDataSource() {
    const paymentDataSource = await this.paymentParameterizationUseCase.listPaymentParameterizations();
    localStorage.removeItem('paymentDataSource');
    localStorage.setItem('paymentDataSource', JSON.stringify(paymentDataSource.map(payment => {
      delete payment.uid;
      return payment;
    })));
  }
}
