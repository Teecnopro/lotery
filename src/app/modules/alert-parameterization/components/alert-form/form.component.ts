import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

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
    MatCardModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class AlertFormComponent {

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Alert form submitted:', form.value);
      // Here you can process the alert form data
      // For example, call a service to save the alert configuration
    } else {
      console.log('Alert form is invalid');
    }
  }
}