import { Component } from '@angular/core';

import { UserListComponent } from '../components/user-list/user-list.component';
import { UserFormComponent } from '../components/user-form/user-form.component';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [UserListComponent, UserFormComponent],
  styleUrl: './users-page.component.scss',
  template: `<div class="layout">
    <div class="form-section">
      <app-user-form></app-user-form>
    </div>
    <div class="form-section">
      <app-user-list></app-user-list>
    </div>
  </div>`,
})
export class UsersPageComponent {}
