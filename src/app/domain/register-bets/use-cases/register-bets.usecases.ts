import { inject } from '@angular/core';

import { RegisterBets, RegisterBetsDetail } from '../models/register-bets.entity';
import { REGISTER_BETS_SERVICE } from '../ports';

export class RegisterBetsUseCase {
  private registerBets = inject(REGISTER_BETS_SERVICE);
  createRegisterBets(data: RegisterBetsDetail): Promise<void> {
    return this.registerBets.create(data);
  }
  deleteRegisterBets(uid: string): Promise<void> {
    return this.registerBets.delete(uid);
  }
  getRegisterBetsByQuery(query: any): Promise<RegisterBets[]> {
    return this.registerBets.getByQuery(query);
  }
  getRegisterBetsByQueryDetail(query: any): Promise<RegisterBetsDetail[]> {
    return this.registerBets.getByQueryDetail(query);
  }
  getRegisterBetsByUid(uid: string): Promise<RegisterBets | null> {
    return this.registerBets.getByUid(uid);
  }
}
