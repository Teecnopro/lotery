import { Injectable } from '@angular/core';
import { filter, Observable, of } from 'rxjs';
import { RegisterBets } from '../../domain/register-bets/models/register-bets.entity';
import { servicesApi } from '../../shared/services/servicesApi';

@Injectable({
    providedIn: 'root'
})
export class RegisterBetsService {

    constructor(
        private servicesApi: servicesApi
    ) { }

    getBets(controller: string): Observable<RegisterBets[]> {
        return this.servicesApi.get<RegisterBets[]>(controller);
    }

    getBetsByPagination(controller: string, query: { [key: string]: any } = {}, pageIndex: number = 1, pageSize: number = 10): Observable<RegisterBets[]> {
        return this.servicesApi.post<RegisterBets[]>(`${controller}/pagination`, { query, pageIndex, pageSize });
    }

    addBet(controller: string, bet: RegisterBets): Observable<RegisterBets> {
        return this.servicesApi.post<RegisterBets>(controller, bet);
    }

    getTotalBets(controller: string,queries: any): Observable<number> {
        return this.servicesApi.post<number>(`${controller}/count`, queries);
    }

    sumBets(controller: string, queries: any): Observable<number> {
        return this.servicesApi.post<number>(`${controller}/sum`, queries);
    }

    deleteBetById(controller: string, id: string): Observable<void> {
        return this.servicesApi.post<void>(`${controller}/delete`, { id });
    }

    deleteBetsByQuery(controller: string, query: any): Observable<void> {
        return this.servicesApi.post<void>(`${controller}/deleteManyBetsByQuery`, { query });
    }

    deleteManyBetsByIds(controller: string, ids: string[]): Observable<void> {
        return this.servicesApi.post<void>(`${controller}/deleteManyBetsByIds`, { ids });
    }

    updateTotalValue(controller: string, queries: any, data: any): Observable<void> {
        return this.servicesApi.post<void>(`${controller}/updateTotalValue`, { queries, data });
    }

}