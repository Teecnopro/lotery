import { inject } from '@angular/core';

import { USER_SERVICE } from '../ports';
import { UserData } from '../models/users.entity';

export class CreateUserUseCase {
  private userService = inject(USER_SERVICE);

  execute(
    user: Omit<UserData, 'uid' | 'state'>,
    password: string
  ): Promise<void> {
    return this.userService.create(user, password);
  }
}
