import { Injectable } from '@angular/core';
import { SellerRepositoryPort } from '../../domain/sellers/ports/seller-repository.port';

@Injectable({ providedIn: 'root' })
export class FirebaseSellerAdapter implements SellerRepositoryPort {
  getAll(filter?: object): Promise<any[]> {
    throw new Error('Method not implemented.');
  }
  create(seller: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
