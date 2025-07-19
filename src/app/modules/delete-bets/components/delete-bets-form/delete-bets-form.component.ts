import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DeleteBetsUseCase } from '../../../../domain/delete-bets/use-cases';

@Component({
  selector: 'app-delete-bets-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './delete-bets-form.component.html',
  styleUrl: './delete-bets-form.component.scss',
})
export class DeleteBetsFormComponent {
  @Output('emitLoading') emitLoading = new EventEmitter<boolean>();
  @Input() loading = false;

  private formBuilder = inject(FormBuilder);
  private deleteBetsUseCase = inject(DeleteBetsUseCase);

  deleteBetForm: FormGroup = this.formBuilder.group({
    startDate: [null, [Validators.required]],
    endDate: [null, [Validators.required]],
  });

  updateList() {
    this.emitLoading.emit(true);
    this.loading = true;
    const { startDate, endDate } = this.deleteBetForm.getRawValue() || {};
    const setStartDate = new Date(startDate);
    setStartDate.setHours(0, 0, 0, 0);
    const setEndDate = new Date(endDate);
    setEndDate.setHours(0, 0, 0, 0);

    this.deleteBetsUseCase.updateList$({ startDate: setStartDate, endDate: setEndDate })
    this.deleteBetForm.reset();
  }
}
