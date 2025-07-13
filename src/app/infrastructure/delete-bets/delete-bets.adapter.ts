import { Injectable } from '@angular/core';

import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  Firestore,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  or,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  setDoc,
  startAfter,
  startAt,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from '@angular/fire/firestore';
import { RegisterBetsDetail } from '../../domain/register-bets/models/register-bets.entity';
import { AlertParameterization } from '../../domain/alert-parameterization/models/alert-parameterization.entity';
import { DeleteBetsServicePort } from '../../domain/delete-bets/ports';
import { ResponseQueryDelete } from '../../domain/delete-bets/models/delete-bets.entity';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseDeleteBetsAdapter implements DeleteBetsServicePort {
  deleteProgress$ = new BehaviorSubject<number>(0);
  private batchSize = 25;

  // Pagination
  history: QueryDocumentSnapshot<DocumentData>[] = [];
  currentIndex = -1;
  alertList: AlertParameterization[] = [];
  private hasNext = false;

  constructor(private firestore: Firestore) {}

  totalToDelete(data: RegisterBetsDetail[]) {
    let sumary = 0;

    data.forEach((item) => {
      sumary += item.value as number;
    });

    return sumary;
  }

  async bulkDelete(startDate: Date, endDate: Date) {
    const startTs = Timestamp.fromDate(startDate);
    const endTs = Timestamp.fromDate(endDate);
    const colRef = collection(this.firestore, 'register-bets');

    const q = query(
      colRef,
      where('date', '>=', startTs),
      where('date', '<=', endTs)
    );

    const snapshot = await getDocs(q);
    const total = snapshot.docs.length;

    if (total === 0) {
      this.deleteProgress$.next(100); // nada por borrar
      return;
    }

    let deleted = 0;

    const chunks = Array.from(
      { length: Math.ceil(total / this.batchSize) },
      (_, i) =>
        snapshot.docs.slice(
          i * this.batchSize,
          i * this.batchSize + this.batchSize
        )
    );

    for (const chunk of chunks) {
      const batch = writeBatch(this.firestore);
      for (const doc of chunk) {
        batch.delete(doc.ref);
      }
      await batch.commit();
      deleted += chunk.length;
      const progress = Math.round((deleted / total) * 100);
      this.deleteProgress$.next(progress);
    }
  }

  async getByDate(
    startDate: Date,
    endDate: Date
  ): Promise<ResponseQueryDelete<RegisterBetsDetail>> {
    const startTs = Timestamp.fromDate(startDate);
    const endTs = Timestamp.fromDate(endDate);
    const colRef = collection(this.firestore, 'register-bets');

    const constraints: QueryConstraint[] = [
      where('date', '>=', startTs),
      where('date', '<=', endTs),
    ];

    const q = query(colRef, ...constraints);

    const snapshotTotal = await getCountFromServer(q);

    constraints.push(limit(10));

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map(
      (doc) => ({ uid: doc.id, ...doc.data() } as RegisterBetsDetail)
    );

    return { data, total: snapshotTotal.data().count };
  }
}
