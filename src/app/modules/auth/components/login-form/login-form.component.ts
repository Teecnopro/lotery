import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { MaterialModule } from '../../../../shared/material/material.module';
import { LoginUseCase } from '../../../../domain/auth/use-cases';
import { FormsImportModule } from '../../../../shared/forms/forms-import.module';
import { NOTIFICATION_PORT } from '../../../../shared/ports';
import { getFirebaseAuthErrorMessage } from '../../../../shared/function/getFirebaseLoginErrorMessage.function';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsImportModule, MaterialModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  private fb = inject(FormBuilder);
  private loginUseCase = inject(LoginUseCase);
  private notification = inject(NOTIFICATION_PORT);

  @Output() loginSuccess = new EventEmitter<void>();
  @Output() recoverPassword = new EventEmitter<void>();

  loading: boolean = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  async login() {
    if (this.form.invalid) return;

    this.loading = true;
    const { email, password } = this.form.value;

    try {
      await this.loginUseCase.execute(email!, password!);
      this.notification.success('Inicio de sesión exitoso');
      this.loginSuccess.emit();
    } catch (error) {
      this.notification.error(getFirebaseAuthErrorMessage(error));
    } finally {
      this.loading = false;
    }
  }

  goToRecoverPassword() {
    this.recoverPassword.emit();
  }
}
