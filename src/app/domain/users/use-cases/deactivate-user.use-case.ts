import { inject } from '@angular/core';

import { USER_SERVICE } from '../ports';

export class DeactivateUserUseCase {
  private userService = inject(USER_SERVICE);

  execute(uid: string): Promise<void> {
    return this.userService.deactivate(uid);
  }
}
