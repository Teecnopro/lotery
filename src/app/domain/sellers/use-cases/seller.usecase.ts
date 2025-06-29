import { inject } from "@angular/core";
import { ISeller } from "../models/seller.model";
import { SELLER_REPOSITORY } from "../ports";
import { SellerRepositoryPort } from "../ports/seller-repository.port";

export class SellerUseCase {
    private sellerRepository = inject(SELLER_REPOSITORY)

    async getAllSellers(): Promise<ISeller[]> {
        return this.sellerRepository.getAll();
    }

    async getSellerById(id: string): Promise<ISeller | null> {
        return this.sellerRepository.getById(id);
    }

    async createSeller(seller: ISeller): Promise<ISeller> {
        return this.sellerRepository.create(seller);
    }

    async updateSeller(seller: ISeller): Promise<ISeller> {
        return this.sellerRepository.update(seller);
    }

    async deleteSeller(id: string): Promise<void> {
        return this.sellerRepository.delete(id);
    }
}