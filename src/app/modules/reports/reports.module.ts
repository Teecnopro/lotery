import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BETS_REPOSITORY_SERVICE } from '../../domain/reports/ports';
import { BetsFirestoreRepository } from '../../infrastructure/reports';
import { CompareBetsUseCase } from '../../domain/reports/use-cases';

@NgModule({
  imports: [CommonModule],
  providers: [
    {
      provide: BETS_REPOSITORY_SERVICE,
      useClass: BetsFirestoreRepository,
    },
    CompareBetsUseCase,
  ],
})
export class ReportsModule {}
