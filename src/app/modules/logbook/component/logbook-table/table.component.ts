import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Subject } from 'rxjs';
import { query } from '@firebase/firestore';

@Component({
    selector: 'app-logbook-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    imports: [MatTableModule, MatPaginatorModule, MatButtonModule, CommonModule, MatIconModule],

    standalone: true
})
export class LogbookTableComponent implements OnInit {
    @Input() queries: Subject<{ [key: string]: string }[]> = new Subject<{ [key: string]: string }[]>();

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
        this.getDataSource();
        this.queries.subscribe((queries) => {
            console.log('Queries received:', queries);
            
            this.getDataSource();
        });
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