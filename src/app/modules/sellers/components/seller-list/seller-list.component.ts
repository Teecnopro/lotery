import { Component, OnInit } from '@angular/core';

import { GetAllSellersUseCase } from '../../../../domain/sellers/use-cases/get-all-sellers.usecase';

@Component({
  template: ``,
})
export class SellerListComponent implements OnInit {
  sellers: any[] = [];

  constructor(private getAllSellers: GetAllSellersUseCase) {}

  async ngOnInit() {
    this.sellers = await this.getAllSellers.execute();
  }
}
