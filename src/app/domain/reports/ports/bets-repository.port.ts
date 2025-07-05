import { IQueryBetsByVendor } from '../../../modules/reports/interface/IReports.interface';

export interface BetsRepositoryPort {
  getBetsByVendorGrouped(
    year: number,
    month: number
  ): Promise<Map<string, IQueryBetsByVendor>>;
}
