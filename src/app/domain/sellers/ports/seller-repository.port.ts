export interface SellerRepositoryPort {
  getAll(filter?: object): Promise<any[]>;
  create(seller: any): Promise<void>;
}
