import { Component, inject, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { WhereCondition } from '../../../../shared/models/query.entity';
import { ListBets, RegisterBets } from '../../../../domain/register-bets/models/register-bets.entity';
import { RegisterBetsUseCase } from '../../../../domain/register-bets/use-cases';

@Component({
  selector: 'app-register-bets-list',
  standalone: true,
  imports: [],
  templateUrl: './register-bets-list.component.html',
  styleUrl: './register-bets-list.component.scss',
})
export class RegisterBetsListComponent implements OnInit {
  private registerBetsUseCase = inject(RegisterBetsUseCase);

  hasNext = false;
  hasPrev = false;

  private defaultConditions: WhereCondition[] = [];
  private defaultDate!: Timestamp;
  private lottery!: any;

  listBets: RegisterBets[] = [];

  ngOnInit(): void {
    this.registerBetsUseCase.listBets$()?.subscribe(value => {
      if (!value) return;
      this.defaultDate = value.date;
      this.lottery = value.lottery;

      this.getData('reset');
    })
  }

  async getData(direction: 'next' | 'prev' | 'reset' = 'next') {
      this.defaultConditions = [
        ["lottery.id", "==", this.lottery?._id],
        ["date", "==", this.defaultDate],
      ]

      const { data, hasNext, hasPrev } =
        await this.registerBetsUseCase.getRegisterBetsByQuery({
          direction,
          whereConditions: this.defaultConditions
        });

      this.listBets = data;
      this.hasNext = hasNext as boolean;
      this.hasPrev = hasPrev as boolean;
    }

}
