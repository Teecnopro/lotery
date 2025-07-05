import { Component, inject, OnInit } from '@angular/core';
import { RegisterBetsFormComponent } from '../../components/register-bets-form/register-bets-form.component';
import { RegisterBetsResumeComponent } from '../../components/register-bets-resume/register-bets-resume.component';
import { RegisterBetsListComponent } from '../../components/register-bets-list/register-bets-list.component';
import { RegisterBetsListDetailComponent } from '../../components/register-bets-list-detail/register-bets-list-detail.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { WhereCondition } from '../../../../shared/models/query.entity';
import { RegisterBetsUseCase } from '../../../../domain/register-bets/use-cases';
import { Timestamp } from '@angular/fire/firestore';
import { RegisterBets } from '../../../../domain/register-bets/models/register-bets.entity';

@Component({
  selector: 'app-register-bets-page',
  standalone: true,
  imports: [
    RegisterBetsFormComponent,
    RegisterBetsResumeComponent,
    RegisterBetsListComponent,
    RegisterBetsListDetailComponent,
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './register-bets-page.component.html',
  styleUrl: './register-bets-page.component.scss',
})
export class RegisterBetsPageComponent implements OnInit {
  registerBet!: RegisterBets;

  isDetail = false;

  filteredOptions = [{
    nameSelected: "Advertencias",
    nameNoSelected: "Ver resumen",
    conditionActive: ["warning", "==", true] as WhereCondition,
    selected: false
  }];

  private registerBetsUseCase = inject(RegisterBetsUseCase);

  private defaultDate!: Timestamp;
  private lottery!: any;

  async ngOnInit() {
    this.registerBetsUseCase.listBets$()?.subscribe((value) => {
      if (!value) return;
      this.defaultDate = value.date;
      this.lottery = value.lottery;
    });
  }

  onFilter(item: any) {
    item.selected = true;

    this.registerBetsUseCase.updateList$({
      date: this.defaultDate,
      lottery: this.lottery,
      whereConditions: item.conditionActive
    })
  }

  onReset(item: any) {
    item.selected = false;

    this.registerBetsUseCase.updateList$({
      date: this.defaultDate,
      lottery: this.lottery,
      resetFilter: true
    })
  }
}
