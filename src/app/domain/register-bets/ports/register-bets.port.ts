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
import { IQueryBetsByVendor } from '../../../modules/reports/interface/IReports.interface';
import { Timestamp } from '@angular/fire/firestore';

export interface RegisterBetsServicePort {
  create(data: RegisterBetsDetail): Promise<void>;
  delete(data: RegisterBetsDetail[]): Promise<void>;
  getByQuery(query: { [key: string]: any }, pageIndex: number, pageSize: number): Promise<RegisterBets[]>;
  listBets$(): Observable<ListBets | null> | null;
  updateList$(data: ListBets): void;
  getDataToResume(query: { [key: string]: any }): Promise<any>;
  getTotalBets(controller: string,query: { [key: string]: string | Timestamp | boolean | number | undefined }): Promise<number>;
  getTotalBetsDetail(controller: string, queries: { [key: string]: any }): Promise<number>;
  getBetsByPagination(
    pageIndex: number,
    pageSize: number,
    queries?: { [key: string]: any },
  ): Promise<RegisterBetsDetail[]>;
  getBetsDetailsByPagination(
    pageIndex: number,
    pageSize: number,
    queries?: { [key: string]: any },
  ): Promise<RegisterBetsDetail[]>;
  getBetsToListResume(query: { [key: string]: any }, pageSize: number, pageIndex: number): Promise<Map<string, IQueryBetsByVendor>>
}
