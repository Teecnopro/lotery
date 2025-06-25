import { Component } from '@angular/core';

import { MaterialModule } from '../../../../shared/material/material.module';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {}
