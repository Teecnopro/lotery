import { inject } from '@angular/core';

import { DELETE_BETS_SERVICE } from '../ports';

import { ResponseQueryDelete } from '../models/delete-bets.entity';
import { RegisterBetsDetail } from '../../register-bets/models/register-bets.entity';

export class DeleteBetsUseCase {
  private deleteBets = inject(DELETE_BETS_SERVICE);

  getByDate(startDate: Date, endDate: Date): Promise<ResponseQueryDelete<RegisterBetsDetail>> {
    return this.deleteBets.getByDate(startDate, endDate);
  }
  bulkDelete(startDate: Date, endDate: Date): void {
    return this.deleteBets.bulkDelete(startDate, endDate);
  }
}
