export interface BetsRepositoryPort {
  getBetsByVendorGrouped(
    year: number,
    month: number
  ): Promise<Map<string, { name: string; value: number }>>;
}
