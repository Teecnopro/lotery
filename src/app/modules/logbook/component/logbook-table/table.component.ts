import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Subject } from 'rxjs';
import { query } from '@firebase/firestore';
import { LogBookUseCases } from '../../../../domain/logBook/use-cases/logBook.usecases';
import { NOTIFICATION_PORT } from '../../../../shared/ports';
import { MatDialog } from '@angular/material/dialog';
import { LogBook } from '../../../../domain/logBook/models/logBook.entity';
import { ACTIONS_LOGBOOK } from '../../../../shared/const/actions';
import { NAME_MODULES } from '../../../../shared/const/modules';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-logbook-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    imports: [MatTableModule, MatPaginatorModule, MatButtonModule, CommonModule, MatIconModule, MatTooltipModule],
    standalone: true
})
export class LogbookTableComponent implements OnInit {
    @Input() queries: Subject<{ [key: string]: string | number }> = new Subject<{ [key: string]: string | number }>();
    private logBookUseCase = inject(LogBookUseCases);
    private notification = inject(NOTIFICATION_PORT);
    actions = ACTIONS_LOGBOOK as {[key: string]: string};
    modules = NAME_MODULES as {[key: string]: string};
    loading: boolean = false;
    totalItems: number = 0;
    pageSize: number = 10;
    pageIndex: number = 1;
    pageSizeOptions: number[] = [5, 10, 20];
    dataSource: LogBook[] = [];

    displayedColumns: string[] = [
        'date',
        'userName',
        'action',
        'module',
        'description',
    ];

    ngOnInit() {
        this.getDataSource();
        this.queries.subscribe((queries) => {
            this.getDataSource(queries);
        });
    }

    async getDataSource(queries?: { [key: string]: string | number }) {
        this.loading = true;
        try {
            const dataSource = await this.logBookUseCase.listLogBooksByPagination(this.pageSize, this.pageIndex, queries);
            this.totalItems = await this.logBookUseCase.getTotalLogBooks(queries);
            if(queries && Object.keys(queries).length > 0 && this.totalItems > 0) {
                this.pageSize = this.totalItems;
                this.pageIndex = 1; // Reset to first page if queries are applied
                this.pageSizeOptions = [this.totalItems];
            } else {
                this.pageSizeOptions = [5, 10, 20];
                this.pageSize = 10; // Default page size
            }
            this.dataSource = dataSource.map((logBook: LogBook) => {
                return {
                    ...logBook,
                    action: this.actions[logBook.action as any] || 'N/A',
                    module: this.modules[logBook.module as any] || 'N/A',
                    userName: logBook.user ? `${logBook.user.name}` : 'N/A',
                };
            });
        } catch (error: any) {
            console.error('Error fetching log books:', error);
            this.notification.error(error?.message || 'Error al cargar los libros de registro');
        } finally {
            this.loading = false;
        }
    }

    editAlert(element: any) {
    }

    onPageChange(event: any) {
        this.pageIndex = event.pageIndex === 0 ? 1 : event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.getDataSource();
    }
}