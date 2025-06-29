import { ISeller } from "../models/seller.model";

export abstract class SellerRepositoryPort {
  abstract getAll(): Promise<ISeller[]>;
  abstract getById(id: string): Promise<ISeller | null>;
  abstract create(seller: ISeller): Promise<ISeller>;
  abstract update(seller: ISeller): Promise<ISeller>;
  abstract delete(id: string): Promise<void>;
}
