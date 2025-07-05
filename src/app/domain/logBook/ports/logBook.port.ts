import { LogBook } from "../models/logBook.entity";

export interface LogBookServicePort {
  createLogBook(data: LogBook): Promise<LogBook>;
  listLogBooksByPagination(pageSize: number, pageIndex: number, queries?:{[key: string]: string}[]): Promise<LogBook[]>;
}