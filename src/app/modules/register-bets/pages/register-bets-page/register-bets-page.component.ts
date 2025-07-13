import { Component, inject, OnInit } from '@angular/core';
import { RegisterBetsFormComponent } from '../../components/register-bets-form/register-bets-form.component';
import { RegisterBetsResumeComponent } from '../../components/register-bets-resume/register-bets-resume.component';
import { RegisterBetsListComponent } from '../../components/register-bets-list/register-bets-list.component';
import { RegisterBetsListDetailComponent } from '../../components/register-bets-list-detail/register-bets-list-detail.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { WhereCondition } from '../../../../shared/models/query.entity';
import { RegisterBetsUseCase } from '../../../../domain/register-bets/use-cases';
import { Timestamp } from '@angular/fire/firestore';
import {
  RegisterBets,
  RegisterBetsDetail,
  ViewDetail,
} from '../../../../domain/register-bets/models/register-bets.entity';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog.component';
import { NOTIFICATION_PORT } from '../../../../shared/ports';
import { LogBookUseCases } from '../../../../domain/logBook/use-cases/logBook.usecases';
import { ACTIONS } from '../../../../shared/const/actions';
import { MODULES } from '../../../../shared/const/modules';
import { AUTH_SESSION } from '../../../../domain/auth/ports';
import { RegisterBetsListResumeComponent } from '../../components/register-bets-list-resume/register-bets-list-resume.component';

@Component({
  selector: 'app-register-bets-page',
  standalone: true,
  imports: [
    RegisterBetsFormComponent,
    RegisterBetsResumeComponent,
    RegisterBetsListComponent,
    RegisterBetsListDetailComponent,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RegisterBetsListResumeComponent,
  ],
  templateUrl: './register-bets-page.component.html',
  styleUrl: './register-bets-page.component.scss',
})
export class RegisterBetsPageComponent implements OnInit {
  registerBet!: RegisterBets;
  private logBookUseCases = inject(LogBookUseCases);
  private user = inject(AUTH_SESSION);

  selectedBets!: { selected: boolean; items: RegisterBetsDetail[] };

  viewDetail: ViewDetail | any = {};

  isDetail = false;
  isResume = false;

  filteredOptions = [
    {
      nameSelected: 'Advertencias',
      nameNoSelected: 'Advertencias',
      conditionActive: ['warning', '==', true] as WhereCondition,
      selected: false,
      resume: false,
      filterViewActive: ['list'],
      filterViewDeactive: ['list'],
    },
    {
      nameSelected: 'Ver resumen',
      nameNoSelected: 'Ver detalle',
      conditionActive: null,
      selected: false,
      resume: true,
      filterViewActive: [],
      filterViewDeactive: ['list'],
    },
  ];

  private registerBetsUseCase = inject(RegisterBetsUseCase);
  private dialog = inject(MatDialog);
  private notification = inject(NOTIFICATION_PORT);

  defaultDate!: Timestamp;
  lottery!: any;

  returnView: 'resume' | 'detail' = 'detail';

  async ngOnInit() {
    this.registerBetsUseCase.listBets$()?.subscribe((value) => {
      if (!value) return;
      this.selectedBets = {
        items: [],
        selected: false,
      };
      this.defaultDate = value.date;
      this.lottery = value.lottery;
      this.isResume = value.resume || false;

      if (!value.returnView) return;
      this.returnView = value.returnView;
    });
  }

  onFilter(item: any) {
    this.filteredOptions = this.filteredOptions.map((option) => {
      if (item.nameSelected !== option.nameSelected) {
        option.selected = false;
      }

      return option;
    });

    item.selected = true;

    this.viewDetail['detail'] = false;

    this.registerBetsUseCase.updateList$({
      date: this.defaultDate,
      lottery: this.lottery,
      whereConditions: item.conditionActive,
      resume: item?.resume || false,
      view: item?.filterViewActive,
    });
  }

  onReset(item: any) {
    item.selected = false;

    this.viewDetail['detail'] = false;

    this.registerBetsUseCase.updateList$({
      date: this.defaultDate,
      lottery: this.lottery,
      resetFilter: true,
      view: item?.filterViewDeactive,
    });
  }

  async deleteBetsDetail() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar registros de apuestas',
        message: '¿Está seguro que desea eliminar esto(s) registros?',
      },
    });

    const confirmed = await firstValueFrom(dialogRef.afterClosed());

    if (confirmed) {
      try {
        await this.registerBetsUseCase
          .deleteRegisterBets(this.selectedBets.items)
          .then(() => {
            this.logBookUseCases.createLogBook({
              action: ACTIONS.DELETE,
              date: new Date().valueOf(),
              user: this.user.getUser()!,
              module: MODULES.REGISTER_BETS,
              description: `Registros de apuestas eliminados por ${
                this.user.getUser()?.name
              }`,
            });
          });

        this.notification.success('Registros eliminados exitosamente');

        this.registerBetsUseCase.updateList$({
          date: this.defaultDate,
          lottery: this.lottery,
          view: ['list', 'list-detail'],
        });
      } catch (error: any) {
        console.error('Error deleting register bets:', error);
        this.notification.error(
          error?.message || 'Error al eliminar los registros'
        );
      }
    }

    try {
    } catch (error) {}
  }

  actionBack() {
    this.isResume = this.returnView === 'resume';
    this.viewDetail.detail = false;

    const selected = this.filteredOptions.find((item) => item.selected);

    if (!selected) {
      // Actualizando metodo del listado
      this.registerBetsUseCase.updateList$({
        date: this.defaultDate,
        lottery: this.lottery,
        view: ['list'],
        resume: this.isResume,
      });

      return;
    }

    this.onFilter(selected);
  }
}
