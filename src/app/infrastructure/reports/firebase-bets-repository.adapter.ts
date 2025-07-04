import { Injectable } from '@angular/core';
import { collection, getDocs, query, where } from '@firebase/firestore';

import { BetsRepositoryPort } from '../../domain/reports/ports';
import { Firestore, Timestamp } from '@angular/fire/firestore';
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

    const betsByVendor = new Map<string, IQueryBetsByVendor>();

    const snapshot = await getDocs(queryBets);

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
}
