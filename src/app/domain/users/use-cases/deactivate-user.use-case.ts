import { inject } from '@angular/core';

import { Timestamp } from '@angular/fire/firestore';

import { USER_SERVICE } from '../ports';

export class DeactivateUserUseCase {
  private userService = inject(USER_SERVICE);

  execute(
    uid: string,
    newState: boolean,
    updatedAt: Timestamp,
    updater: { name: string; id: string }
  ): Promise<void> {
    return this.userService.changeState(uid, newState, updatedAt, updater);
  }
}
