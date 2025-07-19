import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RegisterBets, ViewDetail } from '../../../../domain/register-bets/models/register-bets.entity';
import { WhereCondition } from '../../../../shared/models/query.entity';
import { Timestamp } from '@angular/fire/firestore';
import { RegisterBetsUseCase } from '../../../../domain/register-bets/use-cases';
import { NOTIFICATION_PORT } from '../../../../shared/ports';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-register-bets-list-resume',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    CurrencyPipe,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './register-bets-list-resume.component.html',
  styleUrl: './register-bets-list-resume.component.scss',
})
export class RegisterBetsListResumeComponent implements OnInit {
  @Output() viewDetail = new EventEmitter<ViewDetail>();

  private registerBetsUseCase = inject(RegisterBetsUseCase);
  private notification = inject(NOTIFICATION_PORT);

  private destroy$ = new Subject<void>();

  hasNext = false;
  hasPrev = false;
  loading = false;

  isResume = false;

  grandTotal = 0;

  // Paginación
  total = 0; // opcional, si puedes estimar o contar
  pageSize = 25;
  currentPageIndex = 0; // controla el estado actual

  private defaultConditions: WhereCondition[] = [];
  private defaultDate!: Timestamp;
  private lottery!: any;

  listBets: any[] = [];

  displayedColumns: string[] = ['seller', 'value', 'detail'];

  subscriptions!: Subscription | undefined;

  ngOnInit(): void {
    this.registerBetsUseCase.listBets$()?.subscribe((value) => {
      if (!value) return;
      this.defaultDate = value.date;
      this.lottery = value.lottery;

      this.isResume = value.resume || false;
    });

    this.getData();
  }

  async getData() {
    this.loading = true;

    this.defaultConditions = [
      ['lottery.id', '==', this.lottery?._id],
      ['date', '==', this.defaultDate],
    ];

    try {
      const sellers = await this.registerBetsUseCase.getBetsToListResume({
        whereConditions: this.defaultConditions,
      });

      this.listBets = Array.from(sellers.entries()).map(([i, value]) => ({
        id: i,
        code: value?.code,
        userName: value?.name,
        total: value?.value,
      }));

      this.grandTotal = this.listBets?.reduce(
        (acc, item) => acc + item?.total!,
        0
      );
    } catch (error: any) {
      console.error('Error fetching register bets:', error);
      this.notification.error(
        error?.message || 'Error al cargar los registros de apuestas'
      );
    } finally {
      this.loading = false;
    }
  }

  onViewDetail(sellerId: string) {
    this.viewDetail.emit({ detail: true, sellerId, isSeller: true });

    // Actualizando metodo del listado
    this.registerBetsUseCase.updateList$({
      date: this.defaultDate,
      lottery: this.lottery,
      view: ['list-detail'],
      returnView: 'resume'
    });
  }
}
