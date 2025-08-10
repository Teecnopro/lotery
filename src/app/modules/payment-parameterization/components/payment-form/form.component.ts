import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { PaymentParameterization } from '../../../../domain/payment-parameterization/models/payment-parameterization.entity';
import { Subject, Subscription } from 'rxjs';
import { AUTH_SESSION } from '../../../../domain/auth/ports';
import { PaymentParameterizationUseCase } from '../../../../domain/payment-parameterization/use-cases';
import { NOTIFICATION_PORT } from '../../../../shared/ports';
import { LOG_BOOK_SERVICE } from '../../../../domain/logBook/ports';
import { ACTIONS } from '../../../../shared/const/actions';
import { MODULES } from '../../../../shared/const/modules';
import { AuthUser } from '../../../../domain/auth/models/auth-user.entity';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class PaymentFormComponent {
  @Input() paymentObservable: Subject<PaymentParameterization> | null = null;
  @Input() updateTable: Subject<boolean> | null = null;
  private subscription?: Subscription;
  private user = inject(AUTH_SESSION);
  private paymentUseCases = inject(PaymentParameterizationUseCase);
  private logBook = inject(LOG_BOOK_SERVICE);
  private notification = inject(NOTIFICATION_PORT);

  constructor(private cdr: ChangeDetectorRef) { }
  textButton: string = 'Crear Pago';
  payment: PaymentParameterization = {};
  isEditing: boolean = false;
  loading: boolean = false;

  ngOnInit() {
    if (this.paymentObservable) {
      this.subscription = this.paymentObservable.subscribe(
        (data: PaymentParameterization) => {
          if (data && data.uid !== undefined) {
            this.textButton = 'Editar Pago';
            this.isEditing = true;
          }
          this.payment = { ...data };
          this.cdr.detectChanges();
        }
      );
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    // No hacer unsubscribe del updateTable Subject ya que es manejado por el componente padre
  }

  async onSubmit(form: NgForm) {
    if (!form.valid) {
      this.notification.error('Por favor, complete todos los campos requeridos');
      return;
    }

    const currentUser = this.user.getUser();
    if (!currentUser) {
      this.notification.error('Usuario no autenticado');
      return;
    }

    this.loading = true;
    const formData = { ...form.value };
    const paymentData = { ...this.payment, amount: formData.amount, combined: formData.combined, digits: formData.digits };
    try {
      if (paymentData.digits <= 2 && paymentData.combined) {
        this.notification.error('Los dígitos deben ser mayores a 2 si la opción combinada está activada');
        this.loading = false;
        return;
      }
      const existingPayment = await this.paymentUseCases.getPaymentParameterizationByValue(
        paymentData.amount,
        paymentData.digits,
        paymentData.combined
      );
      if (existingPayment && !this.isEditing) {
        this.notification.error('Ya existe una parametrización de pago con este valor y dígitos');
        this.loading = false;
        return;
      }
      if (!this.isEditing) {
        // Generate a unique ID for new payments
        paymentData.uid = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        paymentData.createdBy = currentUser;
        paymentData.createdAt = Date.now();
        await this.paymentUseCases.createPaymentParameterization(paymentData).then(async (data) => {
          await this.logBook.createLogBook({
            action: ACTIONS.CREATE,
            user: this.user.getUser() as AuthUser,
            date: Date.now().valueOf(),
            module: MODULES.PAYMENT,
            description: `Se creó una nueva parametrización de pago con dígitos ${data.digits} y valor ${data.amount}`,
          });
        });
      } else {
        paymentData.updatedBy = currentUser;
        paymentData.updatedAt = Date.now();
        await this.paymentUseCases.updatePaymentParameterization(paymentData.uid!, paymentData).then(async (data) => {
          await this.logBook.createLogBook({
            action: ACTIONS.UPDATE,
            user: this.user.getUser() as AuthUser,
            date: Date.now().valueOf(),
            module: MODULES.PAYMENT,
            description: `Se actualizó la parametrización de pago con id ${data.uid} y digitos ${paymentData.digits} y valor de ${this.payment.amount} a ${data.amount}`,
          });
        });
      }
      this.notification.success(`Parametrización de pago ${this.isEditing ? 'actualizada' : 'creada'} exitosamente`);
      this.limpiarFormulario(form);
      this.loading = false;
      this.updateTable?.next(true);
    } catch (error: any) {
      console.error('Error saving payment parameterization:', error);
      this.notification.error(error?.message || 'Error al guardar la parametrización de pago');
    } finally {
      this.loading = false;
    }
  }

  limpiarFormulario(form: NgForm) {
    form.resetForm();
    this.textButton = 'Crear Pago';
    this.isEditing = false;
    this.payment = {};
    this.cdr.detectChanges();
  }
}
