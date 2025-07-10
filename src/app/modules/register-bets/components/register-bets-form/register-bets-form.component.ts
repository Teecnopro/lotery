import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import {
  MatOptionModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { sellers } from '../../mocks/mocks';
import { NgFor } from '@angular/common';
import { RegisterBetsUseCase } from '../../../../domain/register-bets/use-cases';
import {
  RegisterBets,
  RegisterBetsDetail,
} from '../../../../domain/register-bets/models/register-bets.entity';
import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
} from '@angular/fire/firestore';
import { AUTH_SESSION } from '../../../../domain/auth/ports';
import { NOTIFICATION_PORT } from '../../../../shared/ports';
import { ISeller } from '../../../../domain/sellers/models/seller.model';
import { lotteries } from '../../../../shared/const';
import { LogoutUseCase } from '../../../../domain/auth/use-cases';
import { SellerUseCase } from '../../../../domain/sellers/use-cases';
import { LogBookUseCases } from '../../../../domain/logBook/use-cases/logBook.usecases';
import { ACTIONS } from '../../../../shared/const/actions';
import { MODULES } from '../../../../shared/const/modules';

@Component({
  selector: 'app-register-bets-form',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    NgFor,
    MatCheckboxModule,
  ],
  templateUrl: './register-bets-form.component.html',
  styleUrl: './register-bets-form.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class RegisterBetsFormComponent implements OnInit {
  @ViewChild('lotterySelect') lotterySelect!: MatSelect;

  private registerBetsUseCase = inject(RegisterBetsUseCase);
  private sellersUseCase = inject(SellerUseCase);
  private logBookUseCases = inject(LogBookUseCases);

  private formBuilder = inject(FormBuilder);

  private user = inject(AUTH_SESSION);
  private notification = inject(NOTIFICATION_PORT);
  private defaultDate!: Timestamp;

  registerBetForm: FormGroup = this.formBuilder.group({
    date: [new Date(), [Validators.required]],
    lottery: [{ value: '', disabled: true }, [Validators.required]],
    seller: [{ value: '' }, [Validators.required]],
    lotteryNumber: [
      '',
      [Validators.required, Validators.minLength(1), Validators.maxLength(5)],
    ],
    combined: [false, [Validators.required]],
    value: [0, [Validators.required, Validators.min(1)]],
  });

  arrayLotteries = lotteries;
  arraySellers: ISeller[] = [];

  constructor() {}

  async ngOnInit() {
    // Inicializando valores por defecto
    this.registerBetForm?.get('lottery')?.setValue(lotteries[0]);
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    this.defaultDate = Timestamp.fromDate(date);

    // Actualizando metodo del listado
    this.registerBetsUseCase.updateList$({
      date: this.defaultDate,
      lottery: this.registerBetForm.get('lottery')?.value,
      view: ['list']
    });

    this.getSellers();
  }

  activeDeactiveSelect(action: 'active' | 'deactive'): void {
    const lottery = this.registerBetForm.get('lottery');

    action === 'active'
      ? (lottery?.enable(), this.lotterySelect.open())
      : lottery?.disable();
  }
  async sendData() {
    const betDetail = this.buildObj();
    const currentUser = this.user.getUser();
    await this.registerBetsUseCase.createRegisterBets(betDetail).then(() => {
      this.logBookUseCases.createLogBook({
        action: ACTIONS.CREATE,
        date: new Date().valueOf(),
        user: currentUser!,
        module: MODULES.REGISTER_BETS,
        description: `Apuesta registrada por ${betDetail.seller?.name} para la lotería ${betDetail.lottery?.name} con número ${betDetail.lotteryNumber} y valor ${betDetail.value}`,
      });
    });

    this.updateList();
  }

  buildObj(): RegisterBetsDetail {
    const form = this.registerBetForm.getRawValue();

    const { uid, name } = this.user.getUser()!;

    const date = new Date(form.date);
    date.setHours(0, 0, 0, 0);

    return {
      lottery: { id: form.lottery._id, name: form.lottery.name },
      date: Timestamp.fromDate(date),
      lotteryNumber: form.lotteryNumber,
      seller: { id: form.seller.uid, name: form.seller.name, code: form.seller.code  },
      combined: form.combined,
      value: form.value,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      creator: { uid, name },
      updater: { uid, name },
    };
  }

  updateList() {
    const form = this.registerBetForm.getRawValue();

    const date = new Date(form.date);
    date.setHours(0, 0, 0, 0);

    // Actualizando metodo del listado
    this.registerBetsUseCase.updateList$({
      date: Timestamp.fromDate(date),
      lottery: form.lottery,
      view: ['list']
    });
  }

  async getSellers() {
    this.arraySellers = await this.sellersUseCase.getSellersActive();
  }
}
