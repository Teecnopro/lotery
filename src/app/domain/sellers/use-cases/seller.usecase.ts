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

    async updateSeller(uid: string, seller: ISeller): Promise<ISeller> {
        return this.sellerRepository.update(uid, seller);
    }

    async deleteSeller(id: string): Promise<void> {
        return this.sellerRepository.delete(id);
    }
    async getSellerByCode(code: string): Promise<ISeller | null> {
        return this.sellerRepository.getSellerByCode(code);
    }

    async getSellersByCodeOrName(codeOrName: string): Promise<ISeller[]> {
        return this.sellerRepository.getSellersByCodeOrName(codeOrName);
    }
    async updateState(id: string, state: boolean): Promise<ISeller> {
        return this.sellerRepository.updateState(id, state);
    }
}