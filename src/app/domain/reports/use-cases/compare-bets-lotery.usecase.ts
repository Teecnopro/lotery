import { inject } from '@angular/core';

import { BETS_REPOSITORY_SERVICE } from '../ports';
import { IFormValues } from '../../../modules/reports/interface/IReports.interface';
import { UserComparison } from '../models/vendor-comparison.entity';
import { lotteryMap } from '../../../shared/const/lotery';

export class CompareBetsByLotery {
  private betsService = inject(BETS_REPOSITORY_SERVICE);

  async execute(
    formValues: IFormValues,
    pageIndex = 0,
    pageSize = 25
  ): Promise<{
    result: UserComparison[];
    total: number;
    overallTotal: number;
  }> {
    const { year, month1, month2 } = formValues;

    const groupedData = await this.betsService.getBetsByLotteryGrouped(
      year!,
      month1!,
      month2!
    );

    const allEntries: UserComparison[] = Array.from(groupedData.entries()).map(
      ([, value]) => ({
        userName: value?.name,
        lottery: value?.nameLottery,
        countLottery: value?.countLottery,
        colorLottery: lotteryMap.get(value?.lotteryId!)?.color,
        total: value?.value,
      })
    );

    const overallTotal = allEntries?.reduce(
      (acc, item) => acc + item?.total!,
      0
    );

    const start = pageIndex * pageSize;
    const end = start + pageSize;
    const paginated = allEntries?.slice(start, end);

    return {
      result: paginated,
      total: allEntries?.length,
      overallTotal,
    };
  }
}
