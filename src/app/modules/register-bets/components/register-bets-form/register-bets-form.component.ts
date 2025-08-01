import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
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
  @ViewChild('myInputNumber') myInputNumber!: ElementRef<HTMLInputElement>;

  private registerBetsUseCase = inject(RegisterBetsUseCase);
  private sellersUseCase = inject(SellerUseCase);
  private logBookUseCases = inject(LogBookUseCases);

  private formBuilder = inject(FormBuilder);

  private user = inject(AUTH_SESSION);
  private notification = inject(NOTIFICATION_PORT);
  private defaultDate!: Timestamp;

  loading = false;

  registerBetForm: FormGroup = this.formBuilder.group({
    date: [new Date(), [Validators.required]],
    lottery: [{ value: '', disabled: true }, [Validators.required]],
    seller: ['', [Validators.required]],
    lotteryNumber: [
      '',
      [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(5),
        Validators.pattern(/^[0-9]+$/),
      ],
    ],
    combined: [false, [Validators.required]],
    value: [null, [Validators.required, Validators.min(1)]],
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
      view: ['list'],
    });

    this.getSellers();
  }

  onSellerSelected() {
    setTimeout(() => {
      this.myInputNumber.nativeElement.focus();
      this.myInputNumber.nativeElement.select();
    }, 100); // Esperar a que se cierre el panel
  }

  activeDeactiveSelect(action: 'active' | 'deactive'): void {
    const lottery = this.registerBetForm.get('lottery');

    action === 'active'
      ? (lottery?.enable(), this.lotterySelect.open())
      : lottery?.disable();
  }
  async sendData() {
    this.loading = true;
    const betDetail = this.buildObj();

    try {
      this.resetForm();
      await this.registerBetsUseCase.createRegisterBets(betDetail);
    } catch (error: any) {
      console.error('Error save register bets:', error);
      this.notification.error(
        error?.message || 'Error al guardar los registros de apuestas'
      );
    } finally {
      this.loading = false;
    }

    this.updateList();
  }

  resetForm() {
    this.registerBetForm.get('value')?.reset(null);
    this.registerBetForm.get('combined')?.reset(false);
    this.registerBetForm.get('lotteryNumber')?.reset('');
  }

  buildObj(): RegisterBetsDetail {
    const form = { ...this.registerBetForm.getRawValue() };

    const { uid, name } = this.user.getUser()!;

    const date = new Date(form.date);
    date.setHours(0, 0, 0, 0);

    return {
      lottery: { id: form.lottery._id, name: form.lottery.name },
      date: Timestamp.fromDate(date),
      lotteryNumber: form.lotteryNumber,
      seller: {
        id: form.seller.uid,
        name: form.seller.name,
        code: form.seller.code,
      },
      combined: form.combined,
      value: form.value,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      creator: { uid, name },
      updater: { uid, name },
    };
  }

  @HostListener('keydown.enter', ['$event'])
  handleEnter(event: KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  updateList() {
    const form = this.registerBetForm.getRawValue();

    const date = new Date(form.date);
    date.setHours(0, 0, 0, 0);

    // Actualizando metodo del listado
    this.registerBetsUseCase.updateList$({
      date: Timestamp.fromDate(date),
      lottery: form.lottery,
      view: ['list'],
    });
  }

  async getSellers() {
    this.arraySellers = await this.sellersUseCase.getSellersActive();
  }
}
