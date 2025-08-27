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
import { REGISTER_BETS_DETAIL } from '../../../../shared/const/controllers';

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
  @Input('defaultDate') defaultDate!: Date;
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

  totalWarning = 0;

  // Paginación
  total = 0; // opcional, si puedes estimar o contar
  pageSize = 45;
  currentPageIndex = 1; // controla el estado actual

  grandTotal = 0;

  private defaultConditions: WhereCondition[] = [];
  private defaultQueries: { [key: string]: any } = {};
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

  subscriptions: any;

  async ngOnInit() {
    this.subscriptions = this.registerBetsUseCase.listBets$()?.subscribe((value) => {
      this.getData();
    });
  }

  ngOnDestroy() {
    this.subscriptions?.unsubscribe();
  }

  async getData(
    filter?: { [key: string]: string | Timestamp | boolean | number | undefined }
  ) {
    this.loading = true;
    const dateObj = this.defaultDate;
    dateObj.setHours(0, 0, 0, 0);

    this.defaultQueries = {
      'lottery.id': this.lottery?._id,
      'date': dateObj
    };

    if (!this.isSeller) {
      this.defaultQueries = {
        ...this.defaultQueries,
        'combined': this.groupedBet.combined,
        'lotteryNumber': this.groupedBet.lotteryNumber
      };
    } else {
      this.defaultQueries = {
        ...this.defaultQueries,
        'seller.id': this.sellerId
      };
    }


    if (filter) {
      this.defaultQueries = {
        ...this.defaultQueries,
        ...filter
      };
    }

    try {
      const data = await this.registerBetsUseCase.getBetsDetailsByPagination(this.currentPageIndex, this.pageSize, this.defaultQueries);
      this.listBets = data;
      this.totalWarning = await this.registerBetsUseCase.getTotalBets(REGISTER_BETS_DETAIL, {...this.defaultQueries, warning: true});
      this.total = await this.registerBetsUseCase.getTotalBets(REGISTER_BETS_DETAIL, {...this.defaultQueries});

      this.grandTotal = this.listBets?.reduce(
        (acc, item) => acc + item?.value!,
        0
      );

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
      this.pageSize = event.pageSize;
      this.currentPageIndex = event.pageIndex + 1;
      this.getData();
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
