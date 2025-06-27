import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { NOTIFICATION_PORT } from '../../../../shared/ports';
import { RecoverPasswordUseCase } from '../../../../domain/auth/use-cases';
import { getFirebaseLoginErrorMessage } from '../../../../shared/function/getFirebaseLoginErrorMessage.function';
import { FormsImportModule } from '../../../../shared/forms/forms-import.module';
import { MaterialModule } from '../../../../shared/material/material.module';

@Component({
  selector: 'app-recovery-password-form',
  standalone: true,
  imports: [FormsImportModule, MaterialModule],
  templateUrl: './recovery-password-form.component.html',
  styleUrl: './recovery-password-form.component.scss',
})
export class RecoveryPasswordFormComponent {
  private fb = inject(FormBuilder);
  private recoveryPasswordUseCase = inject(RecoverPasswordUseCase);
  private notification = inject(NOTIFICATION_PORT);

  @Output() redirectLogin = new EventEmitter<void>();

  loading: boolean = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  async recover() {
    if (this.form.invalid) return;

    this.loading = true;

    const { email } = this.form.value;

    try {
      await this.recoveryPasswordUseCase.execute(email!);
      this.notification.success('Enlace enviado al correo electrónico');
    } catch (error) {
      this.notification.error(getFirebaseLoginErrorMessage(error));
    } finally {
      this.loading = false;
    }
  }

  goToLogin() {
    this.redirectLogin.emit();
  }
}
