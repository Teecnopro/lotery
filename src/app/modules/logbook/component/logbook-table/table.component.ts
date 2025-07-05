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

@Component({
    selector: 'app-logbook-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    imports: [MatTableModule, MatPaginatorModule, MatButtonModule, CommonModule, MatIconModule],
    standalone: true
})
export class LogbookTableComponent implements OnInit {
    @Input() queries: Subject<{ [key: string]: string }[]> = new Subject<{ [key: string]: string }[]>();
    private logBookUseCase = inject(LogBookUseCases);
    private notification = inject(NOTIFICATION_PORT);
    private dialog = inject(MatDialog);
    loading: boolean = false;
    totalItems: number = 0;
    pageSize: number = 10;
    pageIndex: number = 1;
    pageSizeOptions: number[] = [5, 10, 20];
    dataSource: LogBook[] = [];

    displayedColumns: string[] = [
        'date',
        'userName',
        'actionType',
        'module',
        'description',
    ];

    ngOnInit() {
        this.getDataSource();
        this.queries.subscribe((queries) => {
            console.log('Queries received:', queries);
            
            this.getDataSource();
        });
    }

    async getDataSource(queries?: { [key: string]: string }[]) {
        this.loading = true;
        try {
            const dataSource = await this.logBookUseCase.listLogBooksByPagination(this.pageSize, this.pageIndex, queries);
            this.dataSource = dataSource;
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