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

import { lotteries, sellers } from '../../mocks/mocks';
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
import { WhereCondition } from '../../../../shared/models/query.entity';

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
  arraySellers = sellers;

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
    });
  }

  activeDeactiveSelect(action: 'active' | 'deactive'): void {
    const lottery = this.registerBetForm.get('lottery');

    action === 'active'
      ? (lottery?.enable(), this.lotterySelect.open())
      : lottery?.disable();
  }
  async sendData() {
    const betDetail = this.buildObj();

    await this.registerBetsUseCase.createRegisterBets(betDetail);

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
      seller: { id: form.seller._id, name: form.seller.seller },
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
    });
  }
}
