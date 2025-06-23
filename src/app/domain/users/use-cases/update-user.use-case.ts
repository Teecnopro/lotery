import { inject } from '@angular/core';

import { USER_SERVICE } from '../ports';
import { UserData } from '../models/users.entity';

export class UpdateUserUseCase {
  private userService = inject(USER_SERVICE);

  execute(uid: string, updates: Partial<Omit<UserData, 'uid'>>): Promise<void> {
    return this.userService.update(uid, updates);
  }
}
