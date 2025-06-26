import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { lotteries, sellers } from '../../mocks/mocks';
import { NgFor } from '@angular/common';

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
    MatCheckboxModule
  ],
  templateUrl: './register-bets-form.component.html',
  styleUrl: './register-bets-form.component.scss',
  providers: [provideNativeDateAdapter()]
})
export class RegisterBetsFormComponent {
   @ViewChild('lotterySelect') lotterySelect!: MatSelect;

  private formBuilder = inject(FormBuilder);

  registerBetForm: FormGroup = this.formBuilder.group({
    date: [new Date(), [Validators.required]],
    lottery: [{value: "", disabled: true}, [Validators.required], ],
    seller: [{value: ""}, [Validators.required], ],
    lotteryNumber: ["", [Validators.required, Validators.minLength(1), Validators.maxLength(5)], ],
    combined: [false, [Validators.required] ],
    value: [0, [Validators.required, Validators.min(1)]]
  });

  arrayLotteries = lotteries;
  arraySellers = sellers;

  constructor() {}

  activeDeactiveSelect(action: "active" | "deactive"): void {
    const lottery = this.registerBetForm.get("lottery");

    action === "active" ? (lottery?.enable(), this.lotterySelect.open()) : lottery?.disable();
  }

  sendData() {
    console.log(this.registerBetForm.value);
  }
}
