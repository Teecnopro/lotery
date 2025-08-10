import { Injectable } from '@angular/core';

import {
  collection,
  deleteDoc,
  Firestore,
  getCountFromServer,
  getDocs,
  limit,
  query,
  QueryConstraint,
  Timestamp,
  where,
  writeBatch,
} from '@angular/fire/firestore';
import { RegisterBetsDetail } from '../../domain/register-bets/models/register-bets.entity';
import { DeleteBetsServicePort } from '../../domain/delete-bets/ports';
import {
  ListDeleteBets,
  ResponseQueryDelete,
} from '../../domain/delete-bets/models/delete-bets.entity';
import { BehaviorSubject, first, firstValueFrom, Observable } from 'rxjs';
import { RegisterBetsService } from '../register-bets/register-bets.services';
import { REGISTER_BETS, REGISTER_BETS_DETAIL } from '../../shared/const/controllers';

@Injectable({ providedIn: 'root' })
export class FirebaseDeleteBetsAdapter implements DeleteBetsServicePort {
  private betsSubject: BehaviorSubject<ListDeleteBets | null> =
    new BehaviorSubject<ListDeleteBets | null>(null);
  deleteProgress = new BehaviorSubject<number>(0);
  private batchSize = 500;

  constructor(
    private firestore: Firestore,
    private register_bets_api: RegisterBetsService
  ) {}

  listBets$(): Observable<ListDeleteBets | null> | null {
    return this.betsSubject.asObservable();
  }

  deleteProgress$(): Observable<number> {
    return this.deleteProgress.asObservable();
  }

  updateList$(data: ListDeleteBets) {
    return this.betsSubject.next(data);
  }

  totalToDelete(data: RegisterBetsDetail[]) {
    let sumary = 0;

    data.forEach((item) => {
      sumary += item.value as number;
    });

    return sumary;
  }

  async bulkDelete(startDate: Date, endDate: Date) {
    const q = {
      "date.seconds": {
        "$gte": Timestamp.fromDate(startDate).seconds,
        "$lte": Timestamp.fromDate(endDate).seconds
      },
    }
    await firstValueFrom(this.register_bets_api.deleteBetsByQuery(REGISTER_BETS_DETAIL, q));
    await firstValueFrom(this.register_bets_api.deleteBetsByQuery(REGISTER_BETS, q));
  }

  async getByDate(
    startDate: Date,
    endDate: Date
  ): Promise<ResponseQueryDelete<RegisterBetsDetail>> {
    const q = {
      "date.seconds": {
        "$gte": Timestamp.fromDate(startDate).seconds,
        "$lte": Timestamp.fromDate(endDate).seconds
      },
    }
    const rsp = await firstValueFrom(this.register_bets_api.getBetsByPagination(REGISTER_BETS_DETAIL, q, 1, 10));
    return { data: rsp, total: rsp.length };
  }
}
