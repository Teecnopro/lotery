export interface IFormValues {
  year?: number | null;
  month1?: number | null;
  month2?: number | null;
}

export interface IQueryBetsByVendor {
  name: string;
  lotteryId?: string;
  nameLottery?: string;
  value: number;
  countLottery?: number;
  code?: string;
}
