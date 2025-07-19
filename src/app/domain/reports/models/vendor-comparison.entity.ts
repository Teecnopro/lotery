export interface VendorComparison {
  vendorId?: string;
  vendorName?: string;
  valueMonth1?: number;
  valueMonth2?: number;
  total?: number;
  variation?: number;
}

export interface UserComparison extends VendorComparison {
  userId?: string;
  userName?: string;
  lottery?: string;
  countLottery?: number;
  colorLottery?: string;
}
