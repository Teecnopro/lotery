import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RegisterBetsUseCase } from '../../../../domain/register-bets/use-cases';
import { NOTIFICATION_PORT } from '../../../../shared/ports';
import { WhereCondition } from '../../../../shared/models/query.entity';
import { Timestamp } from '@angular/fire/firestore';
import {
  RegisterBets,
  RegisterBetsDetail,
} from '../../../../domain/register-bets/models/register-bets.entity';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-register-bets-list-detail',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    DatePipe,
    CommonModule,
    MatIconModule,
    CurrencyPipe,
    MatTooltipModule,
    MatCheckbox
  ],
  templateUrl: './register-bets-list-detail.component.html',
  styleUrl: './register-bets-list-detail.component.scss',
})
export class RegisterBetsListDetailComponent implements OnInit {
  @Input('grupedBet') groupedBet!: RegisterBets;
  @Output() isSelectToDeleted = new EventEmitter<{selected: boolean, items: RegisterBetsDetail[]}>();
  @Output() emitDetail = new EventEmitter<boolean>();

  private registerBetsUseCase = inject(RegisterBetsUseCase);
  private notification = inject(NOTIFICATION_PORT);

  selection = new SelectionModel<RegisterBets>(true, []);

  hasNext = false;
  hasPrev = false;
  loading = false;

  // Paginación
  total = 0; // opcional, si puedes estimar o contar
  pageSize = 25;
  currentPageIndex = 0; // controla el estado actual

  private defaultConditions: WhereCondition[] = [];

  listBets: RegisterBetsDetail[] = [];

  displayedColumns: string[] = [
    "select",
    "consecutive",
    "seller",
    'lottery',
    'lotteryNumber',
    'combined',
    'value'
  ];

  async ngOnInit() {
    this.registerBetsUseCase.listBets$()?.subscribe((value) => {
      this.getData('reset');
    });
  }

  async getData(
    direction: 'next' | 'prev' | 'reset' = 'next',
    filter?: WhereCondition
  ) {
    this.loading = true;

    this.defaultConditions = [
      ['lottery.id', '==', this.groupedBet.lottery?.id],
      ['date', '==', this.groupedBet.date],
      ['combined', '==', this.groupedBet.combined],
      ['lotteryNumber', '==', this.groupedBet.lotteryNumber],
    ];

    if (filter) {
      this.defaultConditions.push(filter);
    }

    try {
      this.total = await this.registerBetsUseCase.getTotalBets({
        whereConditions: this.defaultConditions,
        bd: 'register-bets-detail',
      });

      const { data, hasNext, hasPrev } =
        await this.registerBetsUseCase.getRegisterBetsByQueryDetail({
          pageSize: this.pageSize,
          direction,
          whereConditions: this.defaultConditions,
        });

      this.listBets = data;
      this.hasNext = hasNext as boolean;
      this.hasPrev = hasPrev as boolean;

      this.selection.clear();

      if (this.listBets.length === 0) {
        this.emitDetail.emit(false);
      }
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.listBets.length;
    return numSelected === numRows;
  }

  isPartialSelected() {
    const numSelected = this.selection.selected.length;
    return numSelected > 0 && !this.isAllSelected();
  }

  toggleAllRows(event: any) {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.listBets);
    }

    this.validateAndEmit()
  }

  toggleRow(row: RegisterBets) {
    this.selection.toggle(row);
    this.validateAndEmit();
  }

  validateAndEmit() {
    const selectedBets = this.selection.selected;
    // console.log("🚀 ~ RegisterBetsListDetailComponent ~ validateAndEmit ~ selectedBets:", selectedBets)

    if (selectedBets.length > 0) {
      this.isSelectToDeleted.emit({selected: true, items: selectedBets});
      return;
    }

    this.isSelectToDeleted.emit({selected: false, items: selectedBets});
  }
}
