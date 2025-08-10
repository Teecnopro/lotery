import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { WhereCondition } from '../../../../shared/models/query.entity';
import {
  ListBets,
  RegisterBets,
  ViewDetail,
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
import { Subject, Subscription, take, takeUntil, toArray } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { query } from '@firebase/firestore';
import { REGISTER_BETS } from '../../../../shared/const/controllers';

@Component({
  selector: 'app-register-bets-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    CurrencyPipe,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './register-bets-list.component.html',
  styleUrl: './register-bets-list.component.scss',
})
export class RegisterBetsListComponent implements OnInit {
  @Output() viewDetail = new EventEmitter<ViewDetail>();

  private registerBetsUseCase = inject(RegisterBetsUseCase);
  private notification = inject(NOTIFICATION_PORT);

  hasNext = false;
  hasPrev = false;
  loading = false;

  private destroy$ = new Subject<void>();

  // Paginación
  total = 0; // opcional, si puedes estimar o contar
  pageSize = 25;
  currentPageIndex = 1; // controla el estado actual

  private defaultConditions: WhereCondition[] = [];
  private query = {}
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

  view = 'list';

  subscriptions!: Subscription | undefined;

  ngOnInit(): void {
    console.log("aqui 2");
    
    this.subscriptions = this.registerBetsUseCase
      .listBets$()
      ?.subscribe((value) => {
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

        this.getData(filter);
      });
  }

  async getData(
    filter?: WhereCondition
  ) {
    this.loading = true;
    const dateObj = this.defaultDate.toDate();
    const formattedDate = dateObj.toISOString().slice(0, 10);
    this.query = {
      'lottery.id': this.lottery?._id,
      'date.seconds': {
        "$gte": Timestamp.fromDate(new Date(`${formattedDate}T00:00:00`)).seconds,
        "$lte": Timestamp.fromDate(new Date(`${formattedDate}T23:59:59`)).seconds
      }
    }
    // TODO: Implement filtering
    // if (filter) {
    //   this.defaultConditions.push(filter);
    // }

    try {
      const [totalResult, dataRegister] = await Promise.all([
        this.registerBetsUseCase.getTotalBets(REGISTER_BETS, this.query),
        this.registerBetsUseCase.getRegisterBetsByQuery(this.query, this.currentPageIndex, this.pageSize),
      ]);
      this.listBets = dataRegister;
      this.total = totalResult;

    } catch (error: any) {
      console.error('Error fetching register bets:', error);
      this.notification.error(
        error?.message || 'Error al cargar los registros de apuestas'
      );
    } finally {
      this.loading = false;
    }
  }

    onPageChange(event: any) {
      this.currentPageIndex = event.pageSize != this.currentPageIndex ? 1 : event.pageIndex + 1;
      this.getData();
    }

  onViewDetail(item: RegisterBets) {
    this.viewDetail.emit({ detail: true, item });

    // Actualizando metodo del listado
    this.registerBetsUseCase.updateList$({
      date: this.defaultDate,
      lottery: this.lottery,
      view: ['list-detail'],
      returnView: 'detail',
    });
  }
}
