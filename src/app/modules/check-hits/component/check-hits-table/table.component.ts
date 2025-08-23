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
import { REGISTER_BETS_DETAIL } from '../../../../shared/const/controllers';
import { Timestamp } from '@angular/fire/firestore';

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
    @Input() queries: Subject<{ [key: string]: string }> = new Subject<{ [key: string]: string }>();
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
        this.queries.subscribe(async (query) => {
            this.lotteryNumber = query['lotteryNumber'] || '';
            await this.getDataSource(query);
            this.calculatePaymentWinner();
        });
    }

    ngOnDestroy() {
    }

    async getDataSource(queries: { [key: string]: any  } = {}, pageSize?: number) {
        this.loading = true;
        try {
            this.totalItems = await this.registerBetsUseCase.getTotalBetsDetail(REGISTER_BETS_DETAIL,queries);
            this.dataSource = await this.registerBetsUseCase.getBetsByPagination(this.pageIndex, this.pageSize, queries);
            if (queries && Object.keys(queries).length > 0) {
                this.dataSource = this.dataSource.map(bet => {
                    return {
                        ...bet,
                        isWinner: this.calculatePrize(bet).isWinner,
                        prize: this.calculatePrize(bet).value
                    };
                }).filter(bet => bet.isWinner);
                this.pageSize = this.totalItems;
                this.arraySize = [this.totalItems];
            } else {
                this.pageSize = pageSize ? pageSize : 10;
                this.arraySize = [10, 20, 50, 100];
            }
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
        this.pageIndex = event.pageSize != this.pageSize ? 1 : event.pageIndex + 1;
        this.getDataSource(undefined, event.pageSize);
    }

    calculatePrize(bet: any): { isWinner: boolean, value: number } {
        let payment: PaymentParameterization | undefined;
        let isWinner = false;
        const isWinnerLotteryNumber: string[] = []
        const copyLotteryNumber = this.lotteryNumber
        for (let i = 0; i < this.lotteryNumber.length; i++) {
            const query = copyLotteryNumber.slice(i + 1);
            if (query.length !== 0) {
                isWinnerLotteryNumber.push(query);
            }
        }
        if (bet.lotteryNumber && isWinnerLotteryNumber.includes(bet.lotteryNumber) && bet.combined === false) {
            payment = this.paymentDataSource.find(payment => payment.digits === bet.lotteryNumber?.length && payment.combined === false);
            if (!payment) {
                return { isWinner: false, value: 0 };
            }
            isWinner = true
        } else if (this.lotteryNumber.length !== bet.lotteryNumber?.length && [1, 2].includes(bet.lotteryNumber?.length!) ) {
            payment = this.paymentDataSource.find(payment => payment.digits === bet.lotteryNumber?.length && payment.combined === bet.combined);
            if (!payment) {
                return { isWinner: false, value: 0 };
            }
            isWinner = true
        } else if (this.lotteryNumber.length !== bet.lotteryNumber?.length && [3].includes(bet.lotteryNumber?.length!) && bet.combined === false && isWinnerLotteryNumber.includes(bet.lotteryNumber!)) {
            payment = this.paymentDataSource.find(payment => payment.digits === bet.lotteryNumber?.length && payment.combined === false && isWinnerLotteryNumber.includes(bet.lotteryNumber!));
            if (!payment) {
                return { isWinner: false, value: 0 };
            }
            isWinner = true
        } else if (this.lotteryNumber.length !== bet.lotteryNumber?.length && [3].includes(bet.lotteryNumber?.length!) && bet.combined === true) {
            payment = this.paymentDataSource.find(payment => payment.digits === bet.lotteryNumber?.length && payment.combined === true && payment.combined == bet.combined);
            if (!payment) {
                return { isWinner: false, value: 0 };
            }
            isWinner = true
        } else if (this.lotteryNumber !== bet.lotteryNumber && this.lotteryNumber.length === bet.lotteryNumber?.length && bet.combined === true) {
            payment = this.paymentDataSource.find(payment => payment.digits === bet.lotteryNumber?.length && payment.combined === true);
            if (!payment) {
                return { isWinner: false, value: 0 };
            }
            isWinner = true;
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
        return { isWinner, value: payment?.amount! * bet.value! || 0 };
    }

    calculatePaymentWinner() {
        this.totalPaymentWinner = this.dataSource.reduce((total, bet) => {
            const prize = this.calculatePrize(bet);
            return total + (prize.isWinner ? prize.value : 0);
        }, 0);
    }
}