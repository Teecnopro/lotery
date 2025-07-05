import { inject } from '@angular/core';

import { ListBets, RegisterBets, RegisterBetsDetail } from '../models/register-bets.entity';
import { REGISTER_BETS_SERVICE } from '../ports';
import { FirebaseQuery, ResponseQuery } from '../../../shared/models/query.entity';
import { Observable } from 'rxjs';

export class RegisterBetsUseCase {
  private registerBets = inject(REGISTER_BETS_SERVICE);
  createRegisterBets(data: RegisterBetsDetail): Promise<void> {
    return this.registerBets.create(data);
  }
  deleteRegisterBets(uid: string): Promise<void> {
    return this.registerBets.delete(uid);
  }
  getRegisterBetsByQuery(query: FirebaseQuery): Promise<ResponseQuery<RegisterBets>> {
    return this.registerBets.getByQuery(query);
  }
  getRegisterBetsByQueryDetail(query: FirebaseQuery): Promise<ResponseQuery<RegisterBetsDetail>> {
    return this.registerBets.getByQueryDetail(query);
  }
  getRegisterBetsByUid(uid: string): Promise<RegisterBets | null> {
    return this.registerBets.getByUid(uid);
  }

  listBets$(): Observable<ListBets | null> | null {
    return this.registerBets.listBets$();
  }

  updateList$(data: ListBets) {
    return this.registerBets.updateList$(data);
  }

  getDataToResume(query: FirebaseQuery): Promise<any> {
    return this.registerBets.getDataToResume(query);
  }

  async getTotalBets(query: FirebaseQuery): Promise<number> {
    return this.registerBets.getTotalBets(query);
  }

  async getBetsByPagination(
    pageIndex: number,
    pageSize: number,
    queries?: { [key: string]: string }[],
  ): Promise<RegisterBetsDetail[]> {
    return this.registerBets.getBetsByPagination(pageIndex, pageSize, queries);
  }

  async getTotalBetsByQueries(queries?: { [key: string]: string }[]): Promise<number> {
    return this.registerBets.getTotalBetsQueries(queries);
  }
}
