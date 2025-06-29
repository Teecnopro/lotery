import { inject } from '@angular/core';

import { RegisterBets, RegisterBetsDetail } from '../models/register-bets.entity';
import { REGISTER_BETS_SERVICE } from '../ports';
import { FirebaseQuery, ResponseQuery } from '../../../shared/models/query.entity';

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
}
