import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { UserData } from '../../../domain/users/models/users.entity';

@Injectable({ providedIn: 'root' })
export class UserStateService {
  private selectedUserSubject = new BehaviorSubject<UserData | null>(null);
  private refreshListSubject = new BehaviorSubject<boolean>(false);

  selectedUser$ = this.selectedUserSubject.asObservable();
  refreshList$ = this.refreshListSubject.asObservable();

  setSelectedUser(user: UserData | null) {
    this.selectedUserSubject.next(user);
  }

  triggerRefreshList(requiredRefresh: boolean) {
    this.refreshListSubject.next(requiredRefresh);
  }
}
