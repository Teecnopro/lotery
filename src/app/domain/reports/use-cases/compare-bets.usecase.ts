import { inject } from '@angular/core';

import { BETS_REPOSITORY_SERVICE } from '../ports';
import { IFormValues } from '../../../modules/reports/interface/IReports.interface';
import { VendorComparison } from '../models/vendor-comparison.entity';

export class CompareBetsUseCase {
  private betsService = inject(BETS_REPOSITORY_SERVICE);

  async execute(formValues: IFormValues): Promise<VendorComparison[]> {
    const { year, month1, month2 } = formValues;

    const [reportByMonth1, reportByMonth2] = await Promise.all([
      this.betsService.getBetsByVendorGrouped(year!, month1!),
      this.betsService.getBetsByVendorGrouped(year!, month2!),
    ]);

    const allVendors = new Set([
      ...reportByMonth1?.keys(),
      ...reportByMonth2?.keys(),
    ]);
    const result: VendorComparison[] = [];

    allVendors?.forEach((id) => {
      const valueReport1 = reportByMonth1.get(id)?.value || 0;
      const valueReport2 = reportByMonth2.get(id)?.value || 0;
      const name = reportByMonth1.get(id)?.name || reportByMonth2.get(id)?.name;

      result.push({
        vendorId: id,
        vendorName: name,
        valueMonth1: valueReport1,
        valueMonth2: valueReport2,
        total: valueReport1 + valueReport2,
        variation: valueReport1 - valueReport2,
      });
    });

    return result;
  }
}
