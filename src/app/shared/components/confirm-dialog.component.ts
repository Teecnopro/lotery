import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MaterialModule } from '../material/material.module';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button mat-dialog-close [mat-dialog-close]="false">
        Cancelar
      </button>
      <button mat-raised-button color="primary" [mat-dialog-close]="true">
        Confirmar
      </button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MaterialModule],
})
export class ConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}
}
