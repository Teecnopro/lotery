export interface ResponseQueryDelete<T> {
  data: T[];
  total: number;
}

export interface ListDeleteBets {
  startDate: Date,
  endDate: Date
}
