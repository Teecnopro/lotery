import { inject, Injectable } from '@angular/core';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
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
  constructor(private firestore: Firestore) {}

  async create(data: RegisterBetsDetail): Promise<void> {
    const bets = collection(this.firestore, 'register-bets-detail');
    await addDoc(bets, {
      ...data,
    });
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
      collection(this.firestore, 'register-bets')
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
}
