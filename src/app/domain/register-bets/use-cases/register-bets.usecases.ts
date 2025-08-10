import { inject } from '@angular/core';

import { ListBets, RegisterBets, RegisterBetsDetail } from '../models/register-bets.entity';
import { REGISTER_BETS_SERVICE } from '../ports';
import { FirebaseQuery, ResponseQuery } from '../../../shared/models/query.entity';
import { Observable } from 'rxjs';
import { IQueryBetsByVendor } from '../../../modules/reports/interface/IReports.interface';
import { Timestamp } from '@angular/fire/firestore';

export class RegisterBetsUseCase {
  private registerBets = inject(REGISTER_BETS_SERVICE);
  createRegisterBets(data: RegisterBetsDetail): Promise<void> {
    return this.registerBets.create(data);
  }
  deleteRegisterBets(data: RegisterBetsDetail[]): Promise<void> {
    return this.registerBets.delete(data);
  }
  getRegisterBetsByQuery(query: { [key: string]: any }, pageIndex: number, pageSize: number): Promise<RegisterBets[]> {
    return this.registerBets.getByQuery(query, pageIndex, pageSize);
  }

  listBets$(): Observable<ListBets | null> | null {
    return this.registerBets.listBets$();
  }

  updateList$(data: ListBets) {
    return this.registerBets.updateList$(data);
  }

  getDataToResume(query: { [key: string]: any }): Promise<any> {
    return this.registerBets.getDataToResume(query);
  }

  async getTotalBets(controller: string, query: { [key: string]: any }): Promise<number> {
    return this.registerBets.getTotalBets(controller, query);
  }

  async getTotalBetsDetail(controller: string, queries: { [key: string]: any }): Promise<number> {
    return this.registerBets.getTotalBetsDetail(controller, queries);
  }

  async getBetsByPagination(
    pageIndex: number,
    pageSize: number,
    queries?: { [key: string]: any },
  ): Promise<RegisterBetsDetail[]> {
    return this.registerBets.getBetsByPagination(pageIndex, pageSize, queries);
  }

  async getBetsDetailsByPagination(
    pageIndex: number,
    pageSize: number,
    queries?: { [key: string]: any },
  ): Promise<RegisterBetsDetail[]> {
    return this.registerBets.getBetsDetailsByPagination(pageIndex, pageSize, queries);
  }

  async getBetsToListResume(query: { [key: string]: any }, pageSize: number = 25, pageIndex: number = 0): Promise<Map<string, IQueryBetsByVendor>> {
    return this.registerBets.getBetsToListResume(query, pageSize, pageIndex);
  }
}
