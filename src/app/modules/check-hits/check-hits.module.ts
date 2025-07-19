import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { REGISTER_BETS_SERVICE } from '../../domain/register-bets/ports';
import { FirebaseRegisterBetsAdapter } from '../../infrastructure/register-bets/register-bets.adapter';
import { RegisterBetsUseCase } from '../../domain/register-bets/use-cases';

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    providers: [
        {
            provide: REGISTER_BETS_SERVICE,
            useClass: FirebaseRegisterBetsAdapter
        },
        RegisterBetsUseCase,
    ],

})
export class CheckHitsModule { }