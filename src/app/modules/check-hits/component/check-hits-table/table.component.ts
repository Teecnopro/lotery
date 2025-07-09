import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { RegisterBetsUseCase } from '../../../../domain/register-bets/use-cases';
import { PaymentParameterization } from '../../../../domain/payment-parameterization/models/payment-parameterization.entity';
import { FirebaseQuery } from '../../../../shared/models/query.entity';
import { NOTIFICATION_PORT } from '../../../../shared/ports';
import { RegisterBetsDetail } from '../../../../domain/register-bets/models/register-bets.entity';
import { Subject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-check-hits-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    standalone: true,
    imports: [
        MatTableModule,
        MatPaginatorModule,
        CommonModule,
        MatIconModule
    ]
})
export class CheckHitsTableComponent {
    @Input() queries: Subject<{ [key: string]: string }[]> = new Subject<{ [key: string]: string }[]>();
    @Input() loading = false;
    private registerBetsUseCase = inject(RegisterBetsUseCase);
    private notification = inject(NOTIFICATION_PORT);
    dataSource: RegisterBetsDetail[] = [];
    paymentDataSource: PaymentParameterization[] = [];
    displayedColumns: string[] = ['numero', 'vendedor', 'combinado', 'valor', 'premio'];
    pageIndex: number = 1;
    pageSize: number = 10;
    totalItems: number = 0;
    lotteryNumber: string = '';
    arraySize: number[] = [10, 20, 50, 100];
    totalPaymentWinner: number = 0;

    constructor(private cdr: ChangeDetectorRef) { }

    async ngOnInit() {
        await this.getDataSource();
        this.getPaymentParameterization();
        this.queries.subscribe(async (queries) => {
            this.lotteryNumber = queries.find(query => query['lotteryNumber'])?.['lotteryNumber'] || '';
            await this.getDataSource(queries);
            this.calculatePaymentWinner();
        });
    }

    ngOnDestroy() {
    }

    async getDataSource(queries?: { [key: string]: string }[]) {
        this.loading = true;
        try {
            this.totalItems = await this.registerBetsUseCase.getTotalBetsByQueries(queries);
            if (queries && queries.length > 0) {
                this.pageSize = this.totalItems;
                this.arraySize = [this.totalItems];
            } else {
                this.pageSize = 10;
                this.arraySize = [10, 20, 50, 100];
            }
            this.dataSource = await this.registerBetsUseCase.getBetsByPagination(this.pageIndex, this.pageSize, queries);
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

    calculatePrize(bet: RegisterBetsDetail): { isWinner: boolean, value: number } {
        let payment: PaymentParameterization | undefined;
        let isWinner = false;
        if (this.lotteryNumber !== bet.lotteryNumber && bet.combined === true) {
            payment = this.paymentDataSource.find(payment => payment.digits === bet.lotteryNumber?.length && payment.combined === true);
            if (!payment) {
                return { isWinner: false, value: 0 };
            }
            isWinner = true
        } else if (this.lotteryNumber === bet.lotteryNumber && bet.combined === true) {
            payment = this.paymentDataSource.find(payment => payment.digits === bet.lotteryNumber?.length && payment.combined === true);
            if (!payment) {
                return { isWinner: false, value: 0 };
            }
            isWinner = true;
        } else if (this.lotteryNumber === bet.lotteryNumber && bet.combined === false) {
            payment = this.paymentDataSource.find(payment => payment.digits === bet.lotteryNumber?.length && payment.combined === false);
            if (!payment) {
                return { isWinner: false, value: 0 };
            }
            isWinner = true;
        }
        return {isWinner, value: payment?.amount! * bet.value! || 0};
    }

    calculatePaymentWinner() {
        this.totalPaymentWinner = this.dataSource.reduce((total, bet) => {
            const prize = this.calculatePrize(bet);
            return total + (prize.isWinner ? prize.value : 0);
        }, 0);
    }
}