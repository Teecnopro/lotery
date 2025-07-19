import { AuthUser } from "../../auth/models/auth-user.entity";
import { ISeller } from "../models/seller.model";

export abstract class SellerRepositoryPort {
  abstract getAll(): Promise<ISeller[]>;
  abstract getById(id: string): Promise<ISeller | null>;
  abstract create(seller: ISeller): Promise<ISeller>;
  abstract update(uid: string, seller: ISeller): Promise<ISeller>;
  abstract delete(id: string): Promise<void>;
  abstract getSellerByCode(code: string): Promise<ISeller | null>;
  abstract getSellersByCodeOrName(codeOrName: string): Promise<ISeller[]>;
  abstract updateState(uid: string, state: boolean, updatedBy: AuthUser): Promise<ISeller>;
  abstract getSellerByPagination(page: number, pageSize: number, queries?: { [key: string]: string }[]): Promise<ISeller[]>;
  abstract getTotalItems(): Promise<number>;
  abstract getSellersActive(): Promise<ISeller[]>;
}
