import { Component, inject } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';

import { FormsImportModule } from '../../../../shared/forms/forms-import.module';
import { MaterialModule } from '../../../../shared/material/material.module';
import {
  CreateUserUseCase,
  UpdateUserUseCase,
} from '../../../../domain/users/use-cases';
import { NOTIFICATION_PORT } from '../../../../shared/ports';
import { AUTH_SESSION } from '../../../../domain/auth/ports';
import { UserData } from '../../../../domain/users/models/users.entity';
import { getFirebaseAuthErrorMessage } from '../../../../shared/function/getFirebaseLoginErrorMessage.function';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [FormsImportModule, MaterialModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent {
  private fb = inject(FormBuilder);
  private createUseCase = inject(CreateUserUseCase);
  private updateUseCase = inject(UpdateUserUseCase);
  private notification = inject(NOTIFICATION_PORT);
  private userSession = inject(AUTH_SESSION);

  loading: boolean = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    name: ['', Validators.required],
    isAdmin: [false],
  });

  async create() {
    if (this.form.invalid) return;

    this.loading = true;

    const { password, email, name, isAdmin } = this.form.value;

    const currentUser = this.userSession.getUser();
    const creator = {
      id: currentUser?.uid ?? '',
      name: currentUser?.email ?? '',
    };
    const now = Timestamp.now();

    const userToSend: UserData = {
      email: email!,
      name: name!,
      isAdmin: isAdmin!,
      createdAt: now,
      creator: creator,
      updatedAt: now,
      updater: creator,
    };

    try {
      await this.createUseCase.execute(userToSend, password!);
      this.notification.success('Usuario creado exitosamente');
      this.form.reset();
    } catch (error) {
      this.notification.error(getFirebaseAuthErrorMessage(error));
    } finally {
      this.loading = false;
    }
  }
}
