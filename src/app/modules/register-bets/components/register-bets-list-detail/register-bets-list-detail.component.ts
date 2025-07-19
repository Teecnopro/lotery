import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-register-bets-list-detail',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    CurrencyPipe,
    MatTooltipModule,
    MatCheckbox,
    MatProgressSpinnerModule
  ],
  templateUrl: './register-bets-list-detail.component.html',
  styleUrl: './register-bets-list-detail.component.scss',
})
export class RegisterBetsListDetailComponent implements OnInit {
  @Input('grupedBet') groupedBet!: RegisterBets;
  @Input('isSeller') isSeller: boolean = false;
  @Input('sellerId') sellerId!: string;
  @Input('defaultDate') defaultDate!: Timestamp;
  @Input('lottery') lottery!: any;

  @Output() isSelectToDeleted = new EventEmitter<{
    selected: boolean;
    items: RegisterBetsDetail[];
  }>();
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

  view = "list-detail";

  listBets: RegisterBetsDetail[] = [];

  displayedColumns: string[] = [
    'select',
    'consecutive',
    'seller',
    'lottery',
    'lotteryNumber',
    'combined',
    'value',
  ];

  async ngOnInit() {
    this.registerBetsUseCase.listBets$()?.subscribe((value) => {

      this.getData('reset');
    });

    if (this.isSeller) {
      this.displayedColumns = this.displayedColumns.filter((item) => item !== 'select');
    }
  }

  async getData(
    direction: 'next' | 'prev' | 'reset' = 'next',
    filter?: WhereCondition
  ) {
    this.loading = true;

    this.defaultConditions = [
      ['lottery.id', '==', this.lottery?._id],
      ['date', '==', this.defaultDate],
    ];

    if (!this.isSeller) {
      this.defaultConditions.push(
        ['combined', '==', this.groupedBet.combined],
        ['lotteryNumber', '==', this.groupedBet.lotteryNumber]
      );
    } else {
      this.defaultConditions.push(['seller.id', '==', this.sellerId]);
    }

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
    const pageSizeChanged = event.pageSize !== this.pageSize;

    // Actualizar el nuevo pageSize
    this.pageSize = event.pageSize;

    let direction: 'next' | 'prev' | 'reset';

    if (pageSizeChanged) {
      // Si cambió el tamaño de página, reiniciar desde la primera página
      this.currentPageIndex = 0;
      direction = 'reset';
    } else {
      const newPage = event.pageIndex;
      if (newPage === 0 && this.currentPageIndex !== 0) {
        direction = 'reset';
      } else if (newPage > this.currentPageIndex) {
        direction = 'next';
      } else {
        direction = 'prev';
      }
      this.currentPageIndex = newPage;
    }

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

    this.validateAndEmit();
  }

  toggleRow(row: RegisterBets) {
    this.selection.toggle(row);
    this.validateAndEmit();
  }

  validateAndEmit() {
    const selectedBets = this.selection.selected;

    if (selectedBets.length > 0) {
      this.isSelectToDeleted.emit({ selected: true, items: selectedBets });
      return;
    }

    this.isSelectToDeleted.emit({ selected: false, items: selectedBets });
  }
}
