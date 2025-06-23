import { inject } from '@angular/core';

import { USER_SERVICE } from '../ports';

export class DeleteUserUseCase {
  private userService = inject(USER_SERVICE);

  execute(uid: string): Promise<void> {
    return this.userService.delete(uid);
  }
}
