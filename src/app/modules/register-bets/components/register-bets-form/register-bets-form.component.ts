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
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgFor } from '@angular/common';
import { RegisterBetsUseCase } from '../../../../domain/register-bets/use-cases';
import { RegisterBetsDetail } from '../../../../domain/register-bets/models/register-bets.entity';
import { AUTH_SESSION } from '../../../../domain/auth/ports';
import { NOTIFICATION_PORT } from '../../../../shared/ports';
import { ISeller } from '../../../../domain/sellers/models/seller.model';
import { lotteries } from '../../../../shared/const';
import { SellerUseCase } from '../../../../domain/sellers/use-cases';

@Component({
  selector: 'app-register-bets-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './register-bets-form.component.html',
  styleUrl: './register-bets-form.component.scss',
})
export class RegisterBetsFormComponent implements OnInit {
  @ViewChild('lotterySelect') lotterySelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('myInputNumber') myInputNumber!: ElementRef<HTMLInputElement>;
  @ViewChild('selectSeller') selectSeller!: ElementRef<HTMLSelectElement>;

  private registerBetsUseCase = inject(RegisterBetsUseCase);
  private sellersUseCase = inject(SellerUseCase);
  private formBuilder = inject(FormBuilder);
  private user = inject(AUTH_SESSION);
  private notification = inject(NOTIFICATION_PORT);

  private defaultDate!: Date;

  loading = false;

  registerBetForm: FormGroup = this.formBuilder.group({
    date: [new Date(), [Validators.required]],
    lottery: [{ value: '' }, [Validators.required]],
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
  color: string = '';

  constructor() {}

  async ngOnInit() {
    // Inicializando valores por defecto
    this.registerBetForm?.get('lottery')?.setValue(lotteries[0]);
    this.color = lotteries[0].color;
    const date = new Date();
    this.defaultDate = date;

    // Actualizando método del listado
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
    }, 100); // Esperar a que se procese el cambio
  }

  onLotterySelected(lottery: any) {
    console.log("🚀 ~ RegisterBetsFormComponent ~ onLotterySelected ~ lottery:", lottery)
    if (lottery && lottery.color) {
      this.color = lottery.color;
      console.log("🚀 ~ RegisterBetsFormComponent ~ onLotterySelected ~ this.color:", this.color)
      this.selectSeller.nativeElement.focus();
    }
  }

  activeDeactiveSelect(action: 'active' | 'deactive'): void {
    const lottery = this.registerBetForm.get('lottery');
    if (action === 'active') {
      lottery?.enable();
      this.lotterySelect.nativeElement.focus();
    } else {
      lottery?.disable();
    }
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
      date: date,
      lotteryNumber: form.lotteryNumber,
      seller: {
        id: form.seller.uid,
        name: form.seller.name,
        code: form.seller.code,
      },
      combined: form.combined,
      value: form.value,
      createdAt: new Date(),
      updatedAt: new Date(),
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
    this.registerBetsUseCase.updateList$({
      date: date,
      lottery: form.lottery,
      view: ['list'],
    });
  }

  async getSellers() {
    this.arraySellers = await this.sellersUseCase.getSellersActive();
  }

  changeColor(color: string) {
    this.color = color;
  }
}
