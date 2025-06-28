import { inject } from "@angular/core";

import { AUTH_SESSION } from "../../auth/ports";
import { USER_SERVICE } from "../ports";

export class LoadUserProfileUseCase {
  private userService = inject(USER_SERVICE);
  private authSession = inject(AUTH_SESSION);

  async execute(uid: string) {
    const userProfile = await this.userService.getByUid(uid);

    this.authSession.setUser({
      uid: userProfile.uid!,
      email: userProfile.email,
      name: userProfile.name,
      isAdmin: userProfile.isAdmin,
    });

    return userProfile;
  }
}
