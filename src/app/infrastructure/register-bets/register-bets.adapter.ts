import { Injectable } from '@angular/core';

import {
  DocumentData,
  Firestore,
  QueryDocumentSnapshot,
  Timestamp,
} from '@angular/fire/firestore';
import { RegisterBetsServicePort } from '../../domain/register-bets/ports';
import {
  ListBets,
  RegisterBets,
  RegisterBetsDetail,
} from '../../domain/register-bets/models/register-bets.entity';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { AlertParameterization } from '../../domain/alert-parameterization/models/alert-parameterization.entity';
import { IQueryBetsByVendor } from '../../modules/reports/interface/IReports.interface';
import { RegisterBetsService } from './register-bets.services';
import { REGISTER_BETS, REGISTER_BETS_DETAIL } from '../../shared/const/controllers';

@Injectable({ providedIn: 'root' })
export class FirebaseRegisterBetsAdapter implements RegisterBetsServicePort {
  private betsSubject: BehaviorSubject<ListBets | null> =
    new BehaviorSubject<ListBets | null>(null);
  private pageSize = 25;

  // Pagination
  history: QueryDocumentSnapshot<DocumentData>[] = [];
  currentIndex = -1;
  alertList: AlertParameterization[] = [];

  constructor(
    private firestore: Firestore,
    private register_bets_api: RegisterBetsService
  ) {
    this.getAlerts();
  }

  listBets$(): Observable<ListBets | null> | null {
    return this.betsSubject.asObservable();
  }

  updateList$(data: ListBets) {
    return this.betsSubject.next(data);
  }

  async create(data: RegisterBetsDetail): Promise<void> {
    this.getAlerts();
    const warning = this.validateAlert(
      data.lotteryNumber!,
      data.value as number,
      data.combined as boolean
    );
    data.warning = warning.isAlert;
    data.alertDescription = warning.description || '';
    await firstValueFrom(this.register_bets_api.addBet(REGISTER_BETS_DETAIL,data));
    const total = await this.grupedTotalValue(data);
    await this.createGroupedBets(data, total);
  }

  async delete(data: RegisterBetsDetail[]): Promise<void> {
    let totalSumary = this.totalToDelete(data);
    const ids = data.map((item) => item._id!);
    await firstValueFrom(this.register_bets_api.deleteManyBets(REGISTER_BETS_DETAIL, ids))
    // TODO: implementar
    await this.deleteOrUpdateGroupedBets(data[0], totalSumary);
  }

  totalToDelete(data: RegisterBetsDetail[]) {
    let sumary = 0;

    data.forEach((item) => {
      sumary += item.value as number;
    });

    return sumary;
  }

  async deleteOrUpdateGroupedBets(data: RegisterBets, total: number) {
    // TODO: implementar
    const q = this.queryBase(data);
    const rsp = await this.getByQuery(q);
    if (rsp.length === 0) {
      return;
    }

    const totalDiff = (rsp[0].groupedValue as number) - total;
    const warning = this.validateAlert(data.lotteryNumber!, totalDiff, data.combined as boolean);
    if (totalDiff > 0) {
      await firstValueFrom(this.register_bets_api.updateTotalValue(REGISTER_BETS, q, {
        updatedAt: data.updatedAt,
        groupedValue: totalDiff,
        warning: warning.isAlert,
        alertDescription: warning.description || '',
      }));
      return;
    }
    await firstValueFrom(this.register_bets_api.deleteBet(REGISTER_BETS, rsp[0].uid!));
  }

  async getByQuery(
    query: {[key: string]: any} = {},
    pageIndex: number = 1,
    pageSize: number = 25,
  ){
    // TODO: implementar ordenar por updatedAt y warning
    return firstValueFrom(this.register_bets_api.getBetsByPagination(REGISTER_BETS, query, pageIndex, pageSize ));
  }

  async getTotalBets(controller: string, query:{[key: string]: string | Timestamp | boolean | number | undefined} = {}): Promise<number> {
    return firstValueFrom(this.register_bets_api.getTotalBets(controller, query));
  }

  async grupedTotalValue(data: RegisterBetsDetail) {
    return firstValueFrom(this.register_bets_api.sumBets(REGISTER_BETS_DETAIL, this.queryBase(data)));
  }

  async createGroupedBets(
    data: RegisterBetsDetail,
    total: number
  ): Promise<void> {
    const warning = this.validateAlert(data.lotteryNumber!, total, data.combined);

    const dataGroupedBets: RegisterBets = {
      lotteryNumber: data.lotteryNumber,
      lottery: data.lottery,
      groupedValue: total,
      combined: data.combined,
      warning: warning.isAlert,
      alertDescription: warning.description || '',
      date: data.date,
      updatedAt: data.updatedAt,
    };
    const rsp = await this.getByQuery(this.queryBase(dataGroupedBets))
    if (rsp.length > 0) {
      return firstValueFrom(this.register_bets_api.updateTotalValue(REGISTER_BETS, this.queryBase(dataGroupedBets), dataGroupedBets));
    }
    await firstValueFrom(this.register_bets_api.addBet(REGISTER_BETS, dataGroupedBets));
  }

  queryBase(
    data: RegisterBetsDetail | RegisterBets
  ) {

    const dateObj = data.date instanceof Timestamp
      ? data.date.toDate()
      : new Timestamp((data.date as any)?.seconds ?? Math.floor(new Date(data.date as any).getTime() / 1000), 0).toDate();
    const formattedDate = dateObj.toISOString().slice(0, 10);
    return {
      "lotteryNumber": data.lotteryNumber,
      "date.seconds": {
        "$gte": Timestamp.fromDate(new Date(`${formattedDate}T00:00:00`)).seconds,
        "$lte": Timestamp.fromDate(new Date(`${formattedDate}T23:59:59`)).seconds
      },
      "combined": data.combined,
      "lottery": data.lottery,
    }
  }

  async getDataToResume(query: {[key: string]: any}): Promise<any> {
    return this.parseDataToResume(query);
  }

  async parseDataToResume(query: {[key: string]: any}): Promise<any> {
    let objParse: any = {};
    objParse['Total'] = await this.getTotalResume(REGISTER_BETS, query);
    objParse['Advertencias'] = await this.getTotalResume(REGISTER_BETS_DETAIL,{...query,warning: true});
    objParse['Comisiones (55%)'] = {
      totalData: undefined,
      cont: Math.round(
        (objParse['Total'].cont - objParse['Advertencias'].cont) * 0.55
      ),
    };
    return objParse;
  }

  async getTotalResume(controller: string, query: { [key: string]: any } = {}) {
    const [total, sumBet] = await Promise.all([
      firstValueFrom(this.register_bets_api.getTotalBets(controller, query)),
      firstValueFrom(this.register_bets_api.sumBets(controller, query))
    ]);
    return { totalData: total, cont: sumBet };
  }

  async getAlerts() {
    const alerts = localStorage.getItem('alertDataSource');
    this.alertList = alerts ? JSON.parse(alerts) : [];
  }

  validateAlert(lotteryNumber: string, groupedValue: number, combined: boolean = false) {
    if (!this.alertList || this.alertList.length === 0)
      return { isAlert: false, description: 'No hay alertas disponibles' };

    const alert = this.alertList.find(
      (alert) =>
        groupedValue > alert.value! && alert.digits === lotteryNumber?.length && alert.combined === combined
    );
    return { isAlert: !!alert, description: alert?.description } as {
      isAlert: boolean;
      description: string;
    };
  }

    async getBetsDetailsByPagination(
    pageIndex: number,
    pageSize: number,
    queries: { [key: string]: string } = {}
  ): Promise<RegisterBetsDetail[]> {
    return firstValueFrom(this.register_bets_api.getBetsByPagination(REGISTER_BETS_DETAIL, queries, pageIndex, pageSize));
  }

  async getBetsByPagination(
    pageIndex: number,
    pageSize: number,
    queries: { [key: string]: string } = {}
  ): Promise<RegisterBetsDetail[]> {
    const q = Object.keys(queries).length > 0 ? this.returnQueries(queries) : {};
    return firstValueFrom(this.register_bets_api.getBetsByPagination(REGISTER_BETS_DETAIL, q, pageIndex, pageSize));
  }

  returnQueries(queries: { [key: string]: string }) {
    const q = {
      "date.seconds": {
        "$gte": Timestamp.fromDate(new Date(`${queries['date']}T00:00:00`)).seconds,
        "$lte": Timestamp.fromDate(new Date(`${queries['date']}T23:59:59`)).seconds
      },
      "lotteryNumber": {
        "$in": this.returnArrayLotteryNumbers(queries['lotteryNumber'])
      },
      "lottery.id": queries['lottery.id'],
    }
    return q;
  }

  async getTotalBetsDetail(controller: string, queries: { [key: string]: any } = {}): Promise<number> {
    const q = Object.keys(queries).length > 0 ? this.returnQueries(queries) : {};
    return firstValueFrom(this.register_bets_api.getTotalBets(controller, q));
  }

  returnArrayLotteryNumbers(lotteryNumber: string): string[] {
    let searchingForLotteryNumbers: string[] = [];
    let searchingForLotteryNumbersThirthDigits: string[] = [];
    let lotteryNumberCopy = lotteryNumber;
    searchingForLotteryNumbers.push(lotteryNumberCopy);
    for (let i = 0; i < lotteryNumber.length; i++) {
      const query = lotteryNumberCopy.slice(i + 1);
      if (query.length !== 0) {
        searchingForLotteryNumbers.push(query);
      }
    }
    if ([3, 4].includes(lotteryNumber.length)) {
      let permutations = this.getListLotteryNumbersPermutations(lotteryNumberCopy);
      searchingForLotteryNumbers = [...searchingForLotteryNumbers, ...permutations];
      if (lotteryNumber.length === 4) {
        let extractFirstDigitFromLotteryNumber = lotteryNumber.slice(1);
        searchingForLotteryNumbersThirthDigits = this.getListLotteryNumbersPermutations(extractFirstDigitFromLotteryNumber);
      }
    }
    // Eliminar números duplicados de lotteryNumberQueries
    searchingForLotteryNumbers = Array.from(new Set(searchingForLotteryNumbers));
    searchingForLotteryNumbersThirthDigits = Array.from(new Set(searchingForLotteryNumbersThirthDigits));
    return [...searchingForLotteryNumbers, ...searchingForLotteryNumbersThirthDigits];
  }

  permute(str: string): string[] {
    const results = new Set<string>();
    function generate(arr: string[], l: number, r: number) {
      if (l === r) {
        results.add(arr.join(''));
      } else {
        for (let i = l; i <= r; i++) {
          [arr[l], arr[i]] = [arr[i], arr[l]]; // swap
          generate([...arr], l + 1, r); // llamada recursiva con copia del array
          // No es necesario deshacer el swap por usar copia [...arr]
        }
      }
    }
    generate(str.split(''), 0, str.length - 1);
    return Array.from(results);
  }

  async getBetsToListResume(query: { [key: string]: any }, pageSize: number = 25, pageIndex: number = 0): Promise<Map<string, IQueryBetsByVendor>> {

    const data = await this.getBetsDetailsByPagination(pageSize, pageIndex, query);
    const betsByVendor = new Map<string, IQueryBetsByVendor>();

    data?.forEach((doc) => {
      const data = doc
      const seller = data?.['seller'];

      const value = data?.['value'] ?? 0;
      const sellerId = seller?.['id'];

      if (!sellerId) return;

      if (!betsByVendor.has(sellerId)) {
        betsByVendor.set(sellerId, {
          name: seller?.['name'],
          code: seller?.['code'],
          value: 0,
        });
      }

      betsByVendor.get(sellerId)!.value += value;
    });

    return betsByVendor;
  }

  getListLotteryNumbersPermutations(lotteryNumber: string): string[] {
    const combinations = this.permute(lotteryNumber);
    const lotteryNumberListPermutations: string[] = [];
    combinations.forEach((comb) => {
      lotteryNumberListPermutations.push(comb);
    });
    return lotteryNumberListPermutations;
  }
}
