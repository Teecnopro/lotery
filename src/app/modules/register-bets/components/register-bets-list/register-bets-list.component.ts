import { Component, inject, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { WhereCondition } from '../../../../shared/models/query.entity';
import {
  ListBets,
  RegisterBets,
} from '../../../../domain/register-bets/models/register-bets.entity';
import { RegisterBetsUseCase } from '../../../../domain/register-bets/use-cases';
import { NOTIFICATION_PORT } from '../../../../shared/ports';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register-bets-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    DatePipe,
    CommonModule,
    MatIconModule,
    CurrencyPipe,
  ],
  templateUrl: './register-bets-list.component.html',
  styleUrl: './register-bets-list.component.scss',
})
export class RegisterBetsListComponent implements OnInit {
  private registerBetsUseCase = inject(RegisterBetsUseCase);
  private notification = inject(NOTIFICATION_PORT);

  hasNext = false;
  hasPrev = false;
  loading = false;

  total = 0; // opcional, si puedes estimar o contar
  pageSize = 25;

  currentPageIndex = 0; // controla el estado actual

  private defaultConditions: WhereCondition[] = [];
  private defaultDate!: Timestamp;
  private lottery!: any;

  listBets: RegisterBets[] = [];

  displayedColumns: string[] = [
    'lottery',
    'lotteryNumber',
    'combined',
    'value',
    'detail',
  ];

  ngOnInit(): void {
    this.registerBetsUseCase.listBets$()?.subscribe((value) => {
      if (!value) return;
      this.defaultDate = value.date;
      this.lottery = value.lottery;

      this.getData('reset');
    });
  }

  async getData(direction: 'next' | 'prev' | 'reset' = 'next') {
    this.loading = true;

    this.defaultConditions = [
      ['lottery.id', '==', this.lottery?._id],
      ['date', '==', this.defaultDate],
    ];

    try {
      this.total = await this.registerBetsUseCase.getTotalBets({
        whereConditions: this.defaultConditions,
      });

      const { data, hasNext, hasPrev } =
        await this.registerBetsUseCase.getRegisterBetsByQuery({
          pageSize: this.pageSize,
          direction,
          whereConditions: this.defaultConditions,
        });

      this.listBets = data;
      this.hasNext = hasNext as boolean;
      this.hasPrev = hasPrev as boolean;
    } catch (error: any) {
      console.error('Error fetching register bets:', error);
      this.notification.error(
        error?.message || 'Error al cargar los registros de apuestas'
      );
    } finally {
      this.loading = false;
    }
  }

  onPageChange(event: PageEvent) {
    const newPage = event.pageIndex;

    let direction: 'next' | 'prev' | 'reset' = 'next';

    if (newPage === 0 && this.currentPageIndex !== 0) {
      direction = 'reset';
    } else if (newPage > this.currentPageIndex) {
      direction = 'next';
    } else if (newPage < this.currentPageIndex) {
      direction = 'prev';
    }

    this.currentPageIndex = newPage;

    this.getData(direction);
  }
}
