import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
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
import { AlertParameterization } from '../../../../domain/alert-parameterization/models/alert-parameterization.entity';
import { AlertParameterizationUseCase } from '../../../../domain/alert-parameterization/use-cases';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatTooltipModule
  ],
  templateUrl: './register-bets-list.component.html',
  styleUrl: './register-bets-list.component.scss',
})
export class RegisterBetsListComponent implements OnInit {
  @Output() viewDetail = new EventEmitter<boolean>();

  private registerBetsUseCase = inject(RegisterBetsUseCase);
  private notification = inject(NOTIFICATION_PORT);

  hasNext = false;
  hasPrev = false;
  loading = false;

  // Paginación
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

      let filter;

      if (value.whereConditions) {
        filter = value.whereConditions;
      }

      if (value.resetFilter) {
        filter = undefined;
      }

      this.getData('reset', filter);
    });
  }

  async getData(direction: 'next' | 'prev' | 'reset' = 'next', filter?: WhereCondition) {
    this.loading = true;

    this.defaultConditions = [
      ['lottery.id', '==', this.lottery?._id],
      ['date', '==', this.defaultDate],
    ];

    if (filter) {
      this.defaultConditions.push(filter)
    }


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

  onViewDetail() {
    this.viewDetail.emit(true);
  }
}
