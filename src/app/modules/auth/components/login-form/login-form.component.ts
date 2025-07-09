import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { MaterialModule } from '../../../../shared/material/material.module';
import { LoginUseCase } from '../../../../domain/auth/use-cases';
import { FormsImportModule } from '../../../../shared/forms/forms-import.module';
import { NOTIFICATION_PORT } from '../../../../shared/ports';
import { getFirebaseAuthErrorMessage } from '../../../../shared/function/getFirebaseLoginErrorMessage.function';
import { LogBookUseCases } from '../../../../domain/logBook/use-cases/logBook.usecases';
import { ACTIONS } from '../../../../shared/const/actions';
import { MODULES } from '../../../../shared/const/modules';
import { AUTH_SESSION } from '../../../../domain/auth/ports';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsImportModule, MaterialModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  @Input() disabled: boolean = false;
  private logBookUseCases = inject(LogBookUseCases);
  private currentUser = inject(AUTH_SESSION)
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
  hidePassword = signal(true);

  async login() {
    if (this.form.invalid) return;

    this.loading = true;
    const { email, password } = this.form.value;

    try {
      await this.loginUseCase.execute(email!, password!).then(() => {
        const currentUser = this.currentUser.getUser();
        this.logBookUseCases.createLogBook({
          date: new Date().valueOf(),
          action: ACTIONS.AUTHENTICATE,
          user: currentUser!,
          module: MODULES.AUTH,
          description: `Usuario ${currentUser?.name} inició sesión`,
        });
      });
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

  clickEvent(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }
}
