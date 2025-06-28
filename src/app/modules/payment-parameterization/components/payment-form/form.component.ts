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
  private subscription?: Subscription;
  private user = inject(AUTH_SESSION);
  constructor(private cdr: ChangeDetectorRef) {}
  textButton: string = 'Crear Pago';
  payment: PaymentParameterization = {};
  isEditing: boolean = false;

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
          console.log('Received payment data:', data);
        }
      );
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSubmit(form: NgForm) {
    const formData = { ...form.value };
    const paymentData = { ...this.payment };
    if (form.valid) {
      paymentData.amount = formData.amount;
      paymentData.combined = formData.combined;
      paymentData.digits = formData.digits;
      if (!this.isEditing) {
        paymentData.createdBy = this.user.getUser();
        paymentData.createdAt = Date.now();
      } else {
        paymentData.updatedBy = this.user.getUser();
        paymentData.updatedAt = Date.now();
      }
      console.log('Form submitted:', form.value);
      // Here you can process the form data
      // For example, call a service to save the payment configuration
    } else {
      console.log('Form is invalid');
    }
    this.limpiarFormulario(form);
  }

  limpiarFormulario(form: NgForm) {
    form.resetForm();
    this.textButton = 'Crear Pago';
    this.isEditing = false;
    this.payment = {};
    this.cdr.detectChanges();
  }
}
