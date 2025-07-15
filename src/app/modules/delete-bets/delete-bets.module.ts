import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DELETE_BETS_SERVICE } from '../../domain/delete-bets/ports';
import { FirebaseDeleteBetsAdapter } from '../../infrastructure/delete-bets/delete-bets.adapter';
import { DeleteBetsUseCase } from '../../domain/delete-bets/use-cases';



@NgModule({
  declarations: [],
  imports: [
    CommonModule, ReactiveFormsModule
  ],
  providers: [
    {
      provide: DELETE_BETS_SERVICE,
      useClass: FirebaseDeleteBetsAdapter
    },
    DeleteBetsUseCase
  ]
})
export class DeleteBetsModule { }
