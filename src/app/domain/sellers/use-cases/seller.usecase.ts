import { inject } from "@angular/core";
import { ISeller } from "../models/seller.model";
import { SELLER_REPOSITORY } from "../ports";
import { SellerRepositoryPort } from "../ports/seller-repository.port";
import { AuthUser } from "../../auth/models/auth-user.entity";

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
    async updateState(uid: string, state: boolean, updatedBy: AuthUser): Promise<ISeller> {
        return this.sellerRepository.updateState(uid, state, updatedBy);
    }
    async getSellerByPagination(
        page: number,
        pageSize: number,
        queries?: { [key: string]: string }[]
    ): Promise<ISeller[]> {
        return this.sellerRepository.getSellerByPagination(page, pageSize, queries);
    }
    async getTotalItems(): Promise<number> {
        const sellers = await this.sellerRepository.getAll();
        return sellers.length;
    }
    getSellersActive(): Promise<ISeller[]> {
        return this.sellerRepository.getSellersActive();
    }
}