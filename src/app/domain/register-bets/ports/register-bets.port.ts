import { Observable } from 'rxjs';
import {
  FirebaseQuery,
  ResponseQuery,
} from '../../../shared/models/query.entity';
import {
  ListBets,
  RegisterBets,
  RegisterBetsDetail,
} from '../models/register-bets.entity';

export interface RegisterBetsServicePort {
  create(data: RegisterBetsDetail): Promise<void>;
  delete(data: RegisterBetsDetail[]): Promise<void>;
  getByQuery(query: FirebaseQuery): Promise<ResponseQuery<RegisterBets>>;
  getByQueryDetail(
    query: FirebaseQuery
  ): Promise<ResponseQuery<RegisterBetsDetail>>;
  getByUid(uid: string): Promise<RegisterBets | null>;
  listBets$(): Observable<ListBets | null> | null;
  updateList$(data: ListBets): void;
  getDataToResume(query: FirebaseQuery): Promise<any>;
  getTotalBets(query: FirebaseQuery): Promise<number>;
  getBetsByPagination(
    pageIndex: number,
    pageSize: number,
    queries?: {[key: string]: string}[],
  ): Promise<RegisterBetsDetail[]>;
  getTotalBetsQueries(queries?: {[key: string]: string}[]): Promise<number>;
}
