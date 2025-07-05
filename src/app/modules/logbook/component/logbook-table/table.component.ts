import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

@Component({
    selector: 'app-logbook-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    imports: [MatTableModule, MatPaginatorModule, MatButtonModule, CommonModule, MatIconModule],

    standalone: true
})
export class LogbookTableComponent implements OnInit {

    loading: boolean = false;
    totalItems: number = 0;
    pageSize: number = 10;
    pageIndex: number = 0;
    pageSizeOptions: number[] = [5, 10, 20];
    dataSource = [{
        date: new Date(),
        userName: 'John Doe',
        description: 'Sample description',
        actionType: 'CREATE',
        module: 'User Management'
    },
    {
        date: new Date(),
        userName: 'Jane Smith',
        description: 'Another sample description',
        actionType: 'UPDATE',
        module: 'Order Management'
    }];

    displayedColumns: string[] = [
        'date',
        'userName',
        'actionType',
        'module',
        'description',
    ];

    ngOnInit() {
    }

    async getDataSource() {
    }

    editAlert(element: any) {
    }

    onPageChange(event: any) {
        this.pageIndex = event.pageIndex === 0 ? 1 : event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.getDataSource();
    }
}