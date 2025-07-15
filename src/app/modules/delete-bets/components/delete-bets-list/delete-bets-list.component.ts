import { Component, inject } from '@angular/core';
import { DeleteBetsUseCase } from '../../../../domain/delete-bets/use-cases';
import { NOTIFICATION_PORT } from '../../../../shared/ports';
import { RegisterBetsDetail } from '../../../../domain/register-bets/models/register-bets.entity';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  ],
  templateUrl: './delete-bets-list.component.html',
  styleUrl: './delete-bets-list.component.scss',
})
export class DeleteBetsListComponent {
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

  async getData(startDate: Date, endDate: Date) {
    this.loading = true;
    try {
      const { data, total } = await this.deleteBetsUseCase.getByDate(
        startDate,
        endDate
      );

      this.listBets = data;
      this.totalMissing = total - data.length;
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
