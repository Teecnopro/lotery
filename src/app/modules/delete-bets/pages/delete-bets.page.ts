import { Component, inject } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';
import { DeleteBetsFormComponent } from '../components/delete-bets-form/delete-bets-form.component';
import { DeleteBetsListComponent } from '../components/delete-bets-list/delete-bets-list.component';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { DeleteBetsUseCase } from '../../../domain/delete-bets/use-cases';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NOTIFICATION_PORT } from '../../../shared/ports';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-bets',
  standalone: true,
  imports: [
    DeleteBetsFormComponent,
    DeleteBetsListComponent,
    CommonModule,
    MatButton,
    MatProgressBarModule,
  ],
  templateUrl: './delete-bets.page.html',
  styleUrl: './delete-bets.page.scss',
})
export class DeleteBetsPage {
  private deleteBetsUseCase = inject(DeleteBetsUseCase);
  private notification = inject(NOTIFICATION_PORT);
  private dialog = inject(MatDialog);
  deleteProgress$ = this.deleteBetsUseCase.deleteProgress$();

  showForm: boolean = false;
  isMobile: boolean = false;

  loading = false;
  loadingForm = false;
  hasData = false;

  startDate!: Date;
  endDate!: Date;

  constructor() {}

  ngOnInit(): void {
    this.deleteBetsUseCase.listBets$()?.subscribe((value) => {
      if (!value) return;

      this.startDate = value.startDate;
      this.endDate = value.endDate;
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  async deleteValidate() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar masivamente registros de apuestas',
        message: '¿Está seguro que desea eliminar esto(s) registros?',
      },
    });

    const confirmed = await firstValueFrom(dialogRef.afterClosed());

    if (confirmed) {
      this.deleteData();
    }
  }

  async deleteData() {
    this.loading = true;
    try {
      await this.deleteBetsUseCase.bulkDelete(this.startDate, this.endDate);
      this.notification.success('Registros eliminados satisfactoriamente!!');
      this.deleteBetsUseCase.updateList$({
        startDate: this.startDate,
        endDate: this.endDate,
      });
    } catch (error: any) {
      console.error('Error fetching register bets:', error);
      this.notification.error(
        error?.message || 'Error al cargar los registros de apuestas'
      );
    } finally {
      this.loading = false;
    }
  }
}
