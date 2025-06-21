import { SellerRepositoryPort } from '../ports/seller-repository.port';

export class GetAllSellersUseCase {
  constructor(private readonly sellerRepo: SellerRepositoryPort) {}

  async execute() {
    return await this.sellerRepo.getAll();
  }
}
