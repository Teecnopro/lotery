import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
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
import { REGISTER_BETS, REGISTER_BETS_DETAIL } from '../../../../shared/const/controllers';
import { mapWhereToMongo } from '../../../../shared/function/mapperWhereConditions';

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
  @Input() warning = false;


  private registerBetsUseCase = inject(RegisterBetsUseCase);
  private notification = inject(NOTIFICATION_PORT);

  hasNext = false;
  hasPrev = false;
  loading = false;

  private destroy$ = new Subject<void>();

  // Paginación
  total = 0; // opcional, si puedes estimar o contar
  pageSize = 45;
  currentPageIndex = 1; // controla el estado actual

  totalWarning = 0;
  grandTotal = 0;

  private defaultConditions: WhereCondition[] = [];
  private query: any = {}
  private defaultDate!: Date;
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

  filterQuery!: any;

  subscriptions!: Subscription | undefined;

  ngOnInit(): void {
    this.subscriptions = this.registerBetsUseCase
      .listBets$()
      ?.subscribe((value) => {
        if (!value) return;

        this.defaultDate = value.date;
        this.lottery = value.lottery;

        this.filterQuery = value || null;

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
    const dateObj = this.defaultDate;
    dateObj.setHours(0, 0, 0, 0);

    this.query = {
      'lottery.id': this.lottery?._id,
      'date': dateObj
    }

    if (filter) {
      this.query = {
        ...this.query,
        ...mapWhereToMongo([filter])
      };
    }

    if (this.query['warning']) {
      this.warning = true;
    }

    try {
      this.listBets = await this.registerBetsUseCase.getRegisterBetsByQuery(this.query, this.currentPageIndex, this.pageSize);

      const [totalResultWarning, totalResult] = await Promise.all([
        this.registerBetsUseCase.getTotalBets(REGISTER_BETS, {...this.query, warning: true}),
        this.registerBetsUseCase.getRegisterBetsByQuery(this.query, 1, 1000000000000000),
      ]);

      this.grandTotal = totalResult?.reduce(
        (acc, item) => acc + item?.groupedValue!,
        0
      );

      this.totalWarning = totalResultWarning || 0;
      this.total = totalResult?.length || 0;

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
      this.pageSize = event.pageSize;
      this.currentPageIndex = event.pageIndex + 1;
      this.getData(this.filterQuery?.whereConditions ? this.filterQuery?.whereConditions : null);
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
