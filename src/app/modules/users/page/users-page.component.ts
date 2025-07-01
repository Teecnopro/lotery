import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';

import { UserListComponent } from '../components/user-list/user-list.component';
import { UserFormComponent } from '../components/user-form/user-form.component';
import { MaterialModule } from '../../../shared/material/material.module';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [UserListComponent, UserFormComponent, MaterialModule, CommonModule],
  styleUrl: './users-page.component.scss',
  template: ` <div class="toolbar">
      <button mat-raised-button color="primary" (click)="toggleForm()">
        {{ showForm ? 'Ocultar formulario' : 'Crear usuario' }}
      </button>
    </div>

    <div class="layout" [class.column]="isMobile">
      <div class="form-section" *ngIf="showForm">
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
  showForm: boolean = false;

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.isMobile = res?.matches;
      });
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
