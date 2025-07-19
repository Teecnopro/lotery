import { Injectable } from '@angular/core';

import { collection, getDocs, query, where } from '@firebase/firestore';
import { Firestore, Timestamp } from '@angular/fire/firestore';

import { BetsRepositoryPort } from '../../domain/reports/ports';
import { IQueryBetsByVendor } from '../../modules/reports/interface/IReports.interface';

@Injectable({ providedIn: 'root' })
export class BetsFirestoreRepository implements BetsRepositoryPort {
  constructor(private firestore: Firestore) {}

  async getBetsByVendorGrouped(
    year: number,
    month: number
  ): Promise<Map<string, IQueryBetsByVendor>> {
    const startDate = Timestamp.fromDate(new Date(year, month - 1, 1));
    const endDate = Timestamp.fromDate(new Date(year, month, 1));

    const refBd = collection(this.firestore, 'register-bets-detail');
    const queryBets = query(
      refBd,
      where('date', '>=', startDate),
      where('date', '<', endDate)
    );

    const snapshot = await getDocs(queryBets);
    const betsByVendor = new Map<string, IQueryBetsByVendor>();

    snapshot?.forEach((doc) => {
      const data = doc.data();
      const seller = data?.['seller'];

      const value = data?.['value'] ?? 0;
      const sellerId = seller?.['id'];

      if (!sellerId) return;

      if (!betsByVendor.has(sellerId)) {
        betsByVendor.set(sellerId, {
          name: seller?.['code '] || seller?.['name'],
          value: 0,
        });
      }

      betsByVendor.get(sellerId)!.value += value;
    });

    return betsByVendor;
  }

  async getBetsByLotteryGrouped(
    year: number,
    monthStart: number,
    monthEnd: number
  ): Promise<Map<string, IQueryBetsByVendor>> {
    const startDate = Timestamp.fromDate(new Date(year, monthStart - 1, 1));
    const endDate = Timestamp.fromDate(new Date(year, monthEnd, 1));

    const refBd = collection(this.firestore, 'register-bets-detail');
    const queryBets = query(
      refBd,
      where('date', '>=', startDate),
      where('date', '<', endDate)
    );

    const snapshot = await getDocs(queryBets);
    const betsGrouped = new Map<string, IQueryBetsByVendor>();

    snapshot?.forEach((doc) => {
      const data = doc.data();
      const creatorUid = data?.['creator']?.['uid'];
      const creatorName = data?.['creator']?.['name'];
      const lotteryId = data?.['lottery']?.['id'];
      const lotteryName = data?.['lottery']?.['name'];
      const value = data?.['value'] ?? 0;

      if (!creatorUid || !lotteryId) return;

      const groupKey = `${creatorUid}_${lotteryId}`;

      if (!betsGrouped.has(groupKey)) {
        betsGrouped.set(groupKey, {
          name: creatorName,
          nameLottery: lotteryName,
          lotteryId,
          countLottery: 0,
          value: 0,
        });
      }

      const group = betsGrouped.get(groupKey)!;
      group.value += value;
      group.countLottery! += 1;
    });

    return betsGrouped;
  }
}
