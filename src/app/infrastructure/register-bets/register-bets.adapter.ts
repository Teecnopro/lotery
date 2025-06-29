import { inject, Injectable } from '@angular/core';

import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { RegisterBetsServicePort } from '../../domain/register-bets/ports';
import {
  RegisterBets,
  RegisterBetsDetail,
} from '../../domain/register-bets/models/register-bets.entity';

@Injectable({ providedIn: 'root' })
export class FirebaseRegisterBetsAdapter implements RegisterBetsServicePort {
  private tope = 12000;

  constructor(private firestore: Firestore) {}

  async create(data: RegisterBetsDetail): Promise<void> {
    data.warning = data.value as number > this.tope;
    const bets = collection(this.firestore, 'register-bets-detail');
    await addDoc(bets, {
      ...data,
    });

    const total = await this.grupedTotalValue(data);
    await this.createGroupedBets(data, total);
  }

  async delete(uid: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'register-bets', uid));
  }

  async getByQuery(query: any): Promise<RegisterBets[]> {
    const querySnapshot = await getDocs(
      collection(this.firestore, 'register-bets')
    );
    return querySnapshot.docs.map((doc) => doc.data() as RegisterBets);
  }

  async getByQueryDetail(query: any): Promise<RegisterBetsDetail[]> {
    const querySnapshot = await getDocs(
      collection(this.firestore, 'register-bets-detail')
    );
    return querySnapshot.docs.map((doc) => doc.data() as RegisterBetsDetail);
  }

  async getByUid(uid: string): Promise<RegisterBets> {
    const payment = await getDoc(
      doc(this.firestore, 'register-bets', uid)
    );
    if (!payment.exists()) throw new Error('Pago no encontrado');
    return payment.data() as RegisterBets;
  }

  async grupedTotalValue(data: RegisterBetsDetail) {
    const betsRef = collection(this.firestore, 'register-bets-detail');

    const q = this.queryBase(data, betsRef)

    const details = await getDocs(q);

    let sumary = 0;

    details.docs.forEach((doc) => {
      const data = doc.data() as RegisterBetsDetail;
      sumary += data.value as number;
    })

    return sumary;
  }

  async createGroupedBets(data: RegisterBetsDetail, total: number): Promise<void> {
    const warning = total > this.tope;

    const dataGroupedBets: RegisterBets = {
      lotteryNumber: data.lotteryNumber,
      lottery: data.lottery,
      groupedValue: total,
      combined: data.combined,
      warning,
      date: data.date,
      updatedAt: data.updatedAt,
    }

    const betsRef = collection(this.firestore, 'register-bets');

    const q = this.queryBase(data, betsRef);

    const bet = (await getDocs(q)).docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (bet.length > 0) {
      await updateDoc(doc(this.firestore, 'register-bets', bet[0].id), { updatedAt: data.updatedAt, groupedValue: total, warning })
      return;
    }

    await addDoc(betsRef, {
      ...dataGroupedBets,
    });
  }

  queryBase(data: RegisterBetsDetail | RegisterBets, ref: CollectionReference<DocumentData, DocumentData>) {
    return query(
      ref,
      where('lotteryNumber', '==', data.lotteryNumber),
      where('date', '==', data.date),
      where('lottery.id', '==', data.lottery?.id),
      where('combined', '==', data.combined),
    )
  }
}
