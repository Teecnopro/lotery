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
  private subscription?: Subscription;
  private user = inject(AUTH_SESSION);
  constructor(private cdr: ChangeDetectorRef) {}
  textButton: string = 'Crear Alerta';
  alert: AlertParameterization = {};
  isEditing: boolean = false;

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

  onSubmit(form: NgForm) {
    const formData = { ...form.value };
    const alertData = { ...this.alert };
    if (form.valid) {
      alertData.value = formData.value;
      if (!this.isEditing) {
        alertData.createdBy = this.user.getUser();
        alertData.createdAt = Date.now();
      } else {
        alertData.updatedBy = this.user.getUser();
        alertData.updatedAt = Date.now();
      }
      console.log('Alert form submitted:', alertData);
    } else {
      console.log('Alert form is invalid');
    }
    this.limpiarFormulario(form);
  }

  limpiarFormulario(form: NgForm) {
    form.resetForm();
    this.textButton = 'Crear Alerta';
    this.isEditing = false;
    this.alert = {};
    this.cdr.detectChanges();
  }
}
