import { Component, EventEmitter, inject, Output } from '@angular/core';
import { DeleteBetsUseCase } from '../../../../domain/delete-bets/use-cases';
import { NOTIFICATION_PORT } from '../../../../shared/ports';
import { RegisterBetsDetail } from '../../../../domain/register-bets/models/register-bets.entity';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-delete-bets-list',
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
  templateUrl: './delete-bets-list.component.html',
  styleUrl: './delete-bets-list.component.scss',
})
export class DeleteBetsListComponent {
  @Output('emitLoading') emitLoading = new EventEmitter<boolean>();
  @Output('emitData') emitData = new EventEmitter<boolean>();

  private deleteBetsUseCase = inject(DeleteBetsUseCase);
  private notification = inject(NOTIFICATION_PORT);

  listBets: RegisterBetsDetail[] = [];
  totalMissing = 0;

  loading = false;

  displayedColumns: string[] = [
    'lottery',
    'lotteryNumber',
    'combined',
    'value',
  ];

  view = 'list';

  ngOnInit(): void {
    this.deleteBetsUseCase.listBets$()?.subscribe((value) => {
      if (!value) return;

      this.getData(value.startDate, value.endDate);
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.deleteBetsUseCase.updateList$(null);
  }

  async getData(startDate: Date, endDate: Date) {
    this.loading = true;
    try {
      const { data, total } = await this.deleteBetsUseCase.getByDate(
        startDate,
        endDate
      );

      this.listBets = data;
      this.totalMissing = total - data.length;
      this.emitLoading.emit(false);
      this.emitData.emit(this.listBets.length > 0)
    } catch (error: any) {
      console.error('Error fetching register bets:', error);
      this.notification.error(
        error?.message || 'Error al cargar los registros de apuestas'
      );
    } finally {
      this.loading = false;
    }
  }
}
