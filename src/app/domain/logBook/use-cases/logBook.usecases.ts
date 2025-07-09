import { inject } from "@angular/core";
import { LogBook } from "../models/logBook.entity";
import { LOG_BOOK_SERVICE, LogBookServicePort } from "../ports";

export class LogBookUseCases implements LogBookServicePort {
    private logBook = inject(LOG_BOOK_SERVICE);

    async createLogBook(data: LogBook): Promise<LogBook> {
        return this.logBook.createLogBook(data);
    }

    async listLogBooksByPagination(pageSize: number, pageIndex: number, queries?: { [key: string]: string | number }): Promise<LogBook[]> {
        return this.logBook.listLogBooksByPagination(pageSize, pageIndex, queries);
    }

    async getTotalLogBooks(queries?: { [key: string]: string | number }): Promise<number> {
        return this.logBook.getTotalLogBooks(queries);
    }
}