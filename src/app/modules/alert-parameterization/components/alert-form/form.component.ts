import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { FormsModule, NgForm, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Subscription, Subject } from 'rxjs';
import { AUTH_SESSION } from '../../../../domain/auth/ports';
import { AlertParameterization } from '../../../../domain/alert-parameterization/models/alert-parameterization.entity';
import { AlertParameterizationUseCase } from '../../../../domain/alert-parameterization/use-cases';
import { NOTIFICATION_PORT } from '../../../../shared/ports';

@Component({
  selector: 'app-alert-form',
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
  styleUrls: ['./form.component.scss'],
})
export class AlertFormComponent implements OnInit, OnDestroy {
  @Input() alertObservable: Subject<AlertParameterization> | null = null;
  @Input() updateTable: Subject<boolean> | null = null;
  private subscription?: Subscription;
  private user = inject(AUTH_SESSION);
  private alertUseCases = inject(AlertParameterizationUseCase);
  private notification = inject(NOTIFICATION_PORT);

  constructor(private cdr: ChangeDetectorRef) { }
  textButton: string = 'Crear Alerta';
  alert: AlertParameterization = {};
  isEditing: boolean = false;
  loading: boolean = false;

  ngOnInit() {
    if (this.alertObservable) {
      this.subscription = this.alertObservable.subscribe((data: AlertParameterization) => {
        if (data && data.uid !== undefined) {
          this.textButton = 'Editar Alerta';
          this.isEditing = true;
        }
        this.alert = { ...data };
        this.cdr.detectChanges();
      });
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
    const alertData = { ...this.alert, value: formData.value, description: formData.description.trim(), digits: formData.digits };
    try {
      const existingAlert = await this.alertUseCases.getAlertParameterizationsByValue(
        alertData.value, 
        alertData.digits
      );
      if (existingAlert && !this.isEditing) {
        this.notification.error('Ya existe una parametrización de alerta con este valor');
        this.loading = false;
        return;
      } 
      if (!this.isEditing) {
        alertData.uid = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        alertData.createdBy = currentUser;
        alertData.createdAt = Date.now();
        await this.alertUseCases.createAlertParameterization(alertData);
      } else {
        alertData.updatedBy = currentUser;
        alertData.updatedAt = Date.now();
        await this.alertUseCases.updateAlertParameterization(alertData.uid!, alertData);
      }
      this.notification.success(`Parametrización de alerta ${this.isEditing ? 'actualizada' : 'creada'} exitosamente`)
      this.limpiarFormulario(form);
      this.loading = false;
      this.updateTable?.next(true);
    } catch (error: any) {
      console.error('Error saving alert parameterization:', error);
      this.notification.error(error?.message || 'Error al guardar la parametrización de alerta');
      this.loading = false;
    } finally {
      this.loading = false;
    }
  }

  limpiarFormulario(form: NgForm) {
    form.resetForm();
    this.textButton = 'Crear Alerta';
    this.isEditing = false;
    this.alert = {};
    this.cdr.detectChanges();
  }
}
