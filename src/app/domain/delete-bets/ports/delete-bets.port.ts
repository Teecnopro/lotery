import {
  RegisterBetsDetail,
} from '../../register-bets/models/register-bets.entity';
import { ResponseQueryDelete } from '../models/delete-bets.entity';

export interface DeleteBetsServicePort {
  getByDate(startDate: Date, endDate: Date): Promise<ResponseQueryDelete<RegisterBetsDetail>>;
  bulkDelete(startDate: Date, endDate: Date): void ;
}
