import { inject } from '@angular/core';

import { DELETE_BETS_SERVICE } from '../ports';

import { ListDeleteBets, ResponseQueryDelete } from '../models/delete-bets.entity';
import { RegisterBetsDetail } from '../../register-bets/models/register-bets.entity';
import { Observable } from 'rxjs';

export class DeleteBetsUseCase {
  private deleteBets = inject(DELETE_BETS_SERVICE);

  getByDate(
    startDate: Date,
    endDate: Date
  ): Promise<ResponseQueryDelete<RegisterBetsDetail>> {
    return this.deleteBets.getByDate(startDate, endDate);
  }
  bulkDelete(startDate: Date, endDate: Date): void {
    return this.deleteBets.bulkDelete(startDate, endDate);
  }
  listBets$(): Observable<ListDeleteBets | null> | null {
    return this.deleteBets.listBets$();
  }
  updateList$(data: ListDeleteBets) {
    return this.deleteBets.updateList$(data);
  }
  deleteProgress$(): Observable<number> {
    return this.deleteBets.deleteProgress$();
  }
}
