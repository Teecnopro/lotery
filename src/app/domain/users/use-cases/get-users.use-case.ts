import { inject } from '@angular/core';

import { USER_SERVICE } from '../ports';
import { UserData } from '../models/users.entity';

export class GetUsersUseCase {
  private userService = inject(USER_SERVICE);

  execute(): Promise<UserData[]> {
    return this.userService.getAll();
  }
}
