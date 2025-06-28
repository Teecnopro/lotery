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
    const paymentData = { ...this.payment };

    try {
      paymentData.amount = formData.amount;
      paymentData.combined = formData.combined;
      paymentData.digits = formData.digits;

      if (!this.isEditing) {
        // Generate a unique ID for new payments
        paymentData.uid = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        paymentData.createdBy = currentUser;
        paymentData.createdAt = Date.now();
        await this.paymentUseCases.createPaymentParameterization(paymentData);
      } else {
        paymentData.updatedBy = currentUser;
        paymentData.updatedAt = Date.now();
        await this.paymentUseCases.updatePaymentParameterization(paymentData.uid!, paymentData);
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
