import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { REGISTER_BETS_SERVICE } from '../../domain/register-bets/ports';
import { FirebaseRegisterBetsAdapter } from '../../infrastructure/register-bets/register-bets.adapter';
import { RegisterBetsUseCase } from '../../domain/register-bets/use-cases';
import { SELLER_REPOSITORY } from '../../domain/sellers/ports';
import { FirebaseSellerAdapter } from '../../infrastructure/sellers/firebase-seller.adapter';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: REGISTER_BETS_SERVICE,
      useClass: FirebaseRegisterBetsAdapter
    },
    {
      provide: SELLER_REPOSITORY,
      useClass: FirebaseSellerAdapter
    },
    RegisterBetsUseCase,
    FirebaseSellerAdapter
  ]
})
export class RegisterBetsModule { }
