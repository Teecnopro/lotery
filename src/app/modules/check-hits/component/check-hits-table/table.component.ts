import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { RegisterBetsUseCase } from '../../../../domain/register-bets/use-cases';
import { PaymentParameterization } from '../../../../domain/payment-parameterization/models/payment-parameterization.entity';
import { FirebaseQuery } from '../../../../shared/models/query.entity';
import { NOTIFICATION_PORT } from '../../../../shared/ports';
import { RegisterBetsDetail } from '../../../../domain/register-bets/models/register-bets.entity';

@Component({
    selector: 'app-check-hits-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    standalone: true,
    imports: [
        MatTableModule,
        MatPaginatorModule,
        CommonModule
    ]
})
export class CheckHitsTableComponent {
    @Input() loading = false;
    private registerBetsUseCase = inject(RegisterBetsUseCase);
    private notification = inject(NOTIFICATION_PORT);
    dataSource: RegisterBetsDetail[] = [];
    paymentDataSource: PaymentParameterization[] = [];
    displayedColumns: string[] = ['numero', 'vendedor', 'combinado', 'valor', 'premio'];
    pageIndex: number = 1;
    pageSize: number = 10;
    totalItems: number = 0;

    constructor(private cdr: ChangeDetectorRef) { }

    async ngOnInit() {
        await this.getDataSource();
        this.getPaymentParameterization();
    }

    ngOnDestroy() {
    }

    async getDataSource(queries?: { [key: string]: string }[]) {
        this.loading = true;
        try {
            this.dataSource = await this.registerBetsUseCase.getBetsByPagination(this.pageIndex, this.pageSize, queries);
            this.totalItems = await this.registerBetsUseCase.getTotalBetsByQueries(queries);
        } catch (error: any) {
            this.notification.error('Error al cargar los vendedores: ' + error.message);
        } finally {
            this.loading = false;
        }
        this.cdr.detectChanges();
    }

    getPaymentParameterization() {
        localStorage.getItem('paymentDataSource');
        const paymentData = localStorage.getItem('paymentDataSource');
        if (paymentData) {
            this.paymentDataSource = JSON.parse(paymentData) as PaymentParameterization[];
        } else {
            this.paymentDataSource = [];
        }
    }

    onPageChange(event: any) {
        this.pageIndex = event.pageIndex === 0 ? 1 : event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.getDataSource();
    }
}