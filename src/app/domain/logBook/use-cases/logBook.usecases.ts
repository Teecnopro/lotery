import { LogBook } from "../models/logBook.entity";
import { LogBookServicePort } from "../ports";

export class LogBookUseCases implements LogBookServicePort {
    constructor(private logBookService: LogBookServicePort) { }

    async createLogBook(data: LogBook): Promise<LogBook> {
        return this.logBookService.createLogBook(data);
    }

    async listLogBooksByPagination(pageSize: number, pageIndex: number, queries: { [key: string]: string }[]): Promise<LogBook[]> {
        return this.logBookService.listLogBooksByPagination(pageSize, pageIndex, queries);
    }
}