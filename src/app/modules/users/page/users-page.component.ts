import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';

import { UserListComponent } from '../components/user-list/user-list.component';
import { UserFormComponent } from '../components/user-form/user-form.component';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [UserListComponent, UserFormComponent],
  styleUrl: './users-page.component.scss',
  template: `<div class="layout" [class.column]="isMobile">
    <div class="form-section">
      <app-user-form></app-user-form>
    </div>
    <div class="table-section">
      <app-user-list></app-user-list>
    </div>
  </div>`,
})
export class UsersPageComponent implements OnInit, OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);
  private destroy$ = new Subject<void>();

  isMobile: boolean = false;

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.isMobile = res?.matches;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
