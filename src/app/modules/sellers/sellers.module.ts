import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SellerFormComponent } from './components/seller-form/form.component';
import { SELLER_REPOSITORY } from '../../domain/sellers/ports';
import { FirebaseSellerAdapter } from '../../infrastructure/sellers/firebase-seller.adapter';
import { SellerUseCase } from '../../domain/sellers/use-cases';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, SellerFormComponent],
    providers: [
        {
            provide: SELLER_REPOSITORY,
            useClass: FirebaseSellerAdapter,
        },
        SellerUseCase
    ],
})
export class SellerModule { }