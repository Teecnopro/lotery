import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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
import { UserStateService } from '../../service/user-state.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [FormsImportModule, MaterialModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private createUseCase = inject(CreateUserUseCase);
  private updateUseCase = inject(UpdateUserUseCase);
  private notification = inject(NOTIFICATION_PORT);
  private userSession = inject(AUTH_SESSION);
  private breakpointObserver = inject(BreakpointObserver);
  private userState = inject(UserStateService);
  private destroy$ = new Subject<void>();

  loading: boolean = false;
  isMobile: boolean = false;
  isEditMode: boolean = false;
  userId!: string;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    name: ['', Validators.required],
    isAdmin: [false],
  });

  private configValidatePassword() {
    const passwordCtrl = this.form.get('password');
    if (this.isEditMode) {
      passwordCtrl?.clearValidators();
    } else {
      passwordCtrl?.setValidators([
        Validators.required,
        Validators.minLength(6),
      ]);
    }
    passwordCtrl?.updateValueAndValidity();
  }

  private configResponsive() {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }

  private detectActionEdit() {
    this.userState.selectedUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          this.configValidatePassword();
          this.userId = user?.uid!;
          this.form.patchValue(user);
          this.isEditMode = true;
        } else {
          this.configValidatePassword();
          this.form.reset();
          this.isEditMode = false;
        }
      });
  }

  ngOnInit(): void {
    this.configResponsive();
    this.detectActionEdit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.userState.setSelectedUser(null);
    this.userState.triggerRefreshList(false);
  }

  async detectAction() {
    if (this.isEditMode) {
      await this.update();
      return;
    }

    await this.create();
  }

  async create() {
    if (this.form.invalid) return;

    this.loading = true;

    const { password, email, name, isAdmin } = this.form.value;

    const currentUser = this.userSession.getUser();
    const creator = {
      id: currentUser?.uid ?? '',
      name: currentUser?.name || currentUser?.email || '',
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
      this.userState.triggerRefreshList(true);
      this.notification.success('Usuario creado exitosamente');
      this.form.reset();
    } catch (error) {
      this.notification.error(getFirebaseAuthErrorMessage(error));
    } finally {
      this.loading = false;
    }
  }

  async update() {
    if (this.form.invalid) return;

    this.loading = true;

    const { email, name, isAdmin } = this.form.value;

    const currentUser = this.userSession.getUser();
    const updater = {
      id: currentUser?.uid ?? '',
      name: currentUser?.name || currentUser?.email || '',
    };

    const userToUpdate: UserData = {
      email: email!,
      name: name!,
      isAdmin: isAdmin!,
      updatedAt: Timestamp.now(),
      updater,
    };

    try {
      await this.updateUseCase.execute(this.userId, userToUpdate);
      this.userState.triggerRefreshList(true);
      this.notification.success('Usuario actualizado exitosamente');
      this.form.reset();
    } catch (error) {
      this.notification.error(getFirebaseAuthErrorMessage(error));
    } finally {
      this.loading = false;
    }
  }
}
