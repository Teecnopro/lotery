import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RegisterBetsUseCase } from '../../../../domain/register-bets/use-cases';
import { Timestamp } from '@angular/fire/firestore';
import { WhereCondition } from '../../../../shared/models/query.entity';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-register-bets-resume',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
    MatTableModule
  ],
  templateUrl: './register-bets-resume.component.html',
  styleUrl: './register-bets-resume.component.scss',
})
export class RegisterBetsResumeComponent implements OnInit {
  private registerBetsUseCase = inject(RegisterBetsUseCase);

  resume: any = [];
  private defaultDate!: Timestamp;

  displayedColumns: string[] = [
    'lottery',
    'records',
    'total',
  ];

  async ngOnInit() {
    this.registerBetsUseCase.listBets$()?.subscribe((value) => {
      if (!value) return;
      this.defaultDate = value.date;

      this.getDataToResume();
    });
  }

  async getDataToResume() {
    const filter: WhereCondition[] = [
      ["date", "==", this.defaultDate]
    ]

    const data = await this.registerBetsUseCase.getDataToResume({whereConditions: filter});
    this.resume = Object.entries(data).map(([key, value]) => ({ key, value }));
  }
}
