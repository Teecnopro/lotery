import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { DeleteBetsFormComponent } from '../components/delete-bets-form/delete-bets-form.component';
import { DeleteBetsListComponent } from '../components/delete-bets-list/delete-bets-list.component';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-delete-bets',
  standalone: true,
  imports: [DeleteBetsFormComponent, DeleteBetsListComponent, CommonModule, MatButton],
  templateUrl: './delete-bets.page.html',
  styleUrl: './delete-bets.page.scss',
})
export class DeleteBetsPage {
  showForm: boolean = false;
  isMobile: boolean = false;

  constructor() {}

  ngOnInit(): void {
    // Inicialización del componente
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }
}
