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
  limit,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  setDoc,
  startAfter,
  startAt,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { RegisterBetsServicePort } from '../../domain/register-bets/ports';
import {
  RegisterBets,
  RegisterBetsDetail,
} from '../../domain/register-bets/models/register-bets.entity';
import { FirebaseQuery, ResponseQuery } from '../../shared/models/query.entity';

@Injectable({ providedIn: 'root' })
export class FirebaseRegisterBetsAdapter implements RegisterBetsServicePort {
  private tope = 12000;
  private pageSize = 5;

  // Pagination
  history: QueryDocumentSnapshot<DocumentData>[] = [];
  currentIndex = -1;
  private hasNext = false;

  constructor(private firestore: Firestore) {}

  async create(data: RegisterBetsDetail): Promise<void> {
    data.warning = (data.value as number) > this.tope;
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

  async getByQuery({
    direction,
    whereConditions,
  }: FirebaseQuery): Promise<ResponseQuery<RegisterBets>> {
    const betRef = collection(this.firestore, 'register-bets');

    if (direction === 'reset') {
      this.currentIndex = -1;
      this.history = [];
    }

    // Aplicando filtros
    const constraints: QueryConstraint[] = [];

    for (const [field, op, value] of whereConditions) {
      constraints.push(where(field, op, value));
    }

    constraints.push(orderBy('updatedAt', 'desc'));

    const cursor = this.history[this.currentIndex] ?? undefined;

    let q;

    if (direction === 'next' && cursor) {
      constraints.push(startAfter(cursor));
    } else if (direction === 'prev' && this.currentIndex > 0) {
      const prevCursor = this.history[this.currentIndex - 2]; // retrocede 2 posiciones para obtener la anterior
      prevCursor ? constraints.push(startAfter(prevCursor)) : null;
      this.currentIndex -= 2; // retrocede manualmente
    }

    constraints.push(limit(this.pageSize));
    console.log(constraints);

    q = query(betRef, ...constraints);

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(
      (doc) => ({ uid: doc.id, ...doc.data() } as RegisterBets)
    );

    // Actualizar historial y cursor
    if (snapshot.docs.length > 0) {
      this.currentIndex++;
      this.history[this.currentIndex] = snapshot.docs[snapshot.docs.length - 1];
    }

    this.hasNext = snapshot.docs.length === this.pageSize;

    return { data, hasNext: this.hasNext, hasPrev: this.currentIndex > 0 };
  }

  async getByQueryDetail({
    cursor,
    direction,
  }: FirebaseQuery): Promise<ResponseQuery<RegisterBetsDetail>> {
    const betRef = collection(this.firestore, 'register-bets-detail');
    let q;

    if (cursor) {
      q =
        direction === 'next'
          ? query(
              betRef,
              orderBy('fecha', 'desc'),
              startAfter(cursor),
              limit(this.pageSize)
            )
          : query(
              betRef,
              orderBy('fecha', 'desc'),
              startAt(cursor),
              limit(this.pageSize)
            );
    } else {
      q = query(betRef, orderBy('fecha', 'desc'), limit(this.pageSize));
    }

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(
      (doc) => ({ uid: doc.id, ...doc.data() } as RegisterBetsDetail)
    );
    return { data, docs: snapshot.docs };
  }

  async getByUid(uid: string): Promise<RegisterBets> {
    const payment = await getDoc(doc(this.firestore, 'register-bets', uid));
    if (!payment.exists()) throw new Error('Pago no encontrado');
    return payment.data() as RegisterBets;
  }

  async grupedTotalValue(data: RegisterBetsDetail) {
    const betsRef = collection(this.firestore, 'register-bets-detail');

    const q = this.queryBase(data, betsRef);

    const details = await getDocs(q);

    let sumary = 0;

    details.docs.forEach((doc) => {
      const data = doc.data() as RegisterBetsDetail;
      sumary += data.value as number;
    });

    return sumary;
  }

  async createGroupedBets(
    data: RegisterBetsDetail,
    total: number
  ): Promise<void> {
    const warning = total > this.tope;

    const dataGroupedBets: RegisterBets = {
      lotteryNumber: data.lotteryNumber,
      lottery: data.lottery,
      groupedValue: total,
      combined: data.combined,
      warning,
      date: data.date,
      updatedAt: data.updatedAt,
    };

    const betsRef = collection(this.firestore, 'register-bets');

    const q = this.queryBase(data, betsRef);

    const bet = (await getDocs(q)).docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (bet.length > 0) {
      await updateDoc(doc(this.firestore, 'register-bets', bet[0].id), {
        updatedAt: data.updatedAt,
        groupedValue: total,
        warning,
      });
      return;
    }

    await addDoc(betsRef, {
      ...dataGroupedBets,
    });
  }

  queryBase(
    data: RegisterBetsDetail | RegisterBets,
    ref: CollectionReference<DocumentData, DocumentData>
  ) {
    return query(
      ref,
      where('lotteryNumber', '==', data.lotteryNumber),
      where('date', '==', data.date),
      where('lottery.id', '==', data.lottery?.id),
      where('combined', '==', data.combined)
    );
  }
}
