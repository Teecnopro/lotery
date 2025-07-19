import { Observable } from 'rxjs';
import { RegisterBetsDetail } from '../../register-bets/models/register-bets.entity';
import {
  ListDeleteBets,
  ResponseQueryDelete,
} from '../models/delete-bets.entity';

export interface DeleteBetsServicePort {
  getByDate(
    startDate: Date,
    endDate: Date
  ): Promise<ResponseQueryDelete<RegisterBetsDetail>>;
  bulkDelete(startDate: Date, endDate: Date): void;
  listBets$(): Observable<ListDeleteBets | null> | null;
  updateList$(data: ListDeleteBets | null): void;
  deleteProgress$(): Observable<number>;
}
