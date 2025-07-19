import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

import { NotificationPort } from '../ports';

@Injectable({ providedIn: 'root' })
export class MaterialNotificationAdapter implements NotificationPort {
  constructor(private snackBar: MatSnackBar) {}

  private show(message: string, panelClass: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  success(message: string): void {
    this.show(message, 'snackbar-success');
  }

  error(message: string): void {
    this.show(message, 'snackbar-error');
  }

  info(message: string): void {
    this.show(message, 'snackbar-info');
  }

  warn(message: string): void {
    this.show(message, 'snackbar-warn');
  }
}
