import { Injectable } from '@angular/core';
import { SellerRepositoryPort } from '../../domain/sellers/ports/seller-repository.port';

import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  setDoc,
  startAfter,
  startAt,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { ISeller } from '../../domain/sellers/models/seller.model';
import { last } from 'rxjs';
import { AuthUser } from '../../domain/auth/models/auth-user.entity';

@Injectable({ providedIn: 'root' })
export class FirebaseSellerAdapter implements SellerRepositoryPort {
  constructor(private firestore: Firestore) { }
  async getAll(): Promise<ISeller[]> {
    const sellersRef = collection(this.firestore, 'sellers');
    const querySnapshot = await getDocs(sellersRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ISeller));
  }

  async getById(id: string): Promise<ISeller | null> {
    const sellerRef = doc(this.firestore, 'sellers', id);
    const sellerSnap = await getDoc(sellerRef);
    if (!sellerSnap.exists()) return null;
    return { id: sellerSnap.id, ...sellerSnap.data() } as ISeller;
  }

  async findAll() {
    const sellersRef = collection(this.firestore, 'sellers');
    const querySnapshot = await getDocs(sellersRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async findById(id: string) {
    const sellerRef = doc(this.firestore, 'sellers', id);
    const sellerSnap = await getDoc(sellerRef);
    if (!sellerSnap.exists()) return null;
    return { id: sellerSnap.id, ...sellerSnap.data() };
  }

  async create(seller: any) {
    const sellerRef = doc(this.firestore, 'sellers', seller.uid);
    await setDoc(sellerRef, seller);
    return seller;
  }

  async update(uid: string, seller: ISeller): Promise<ISeller> {
    const sellerRef = doc(this.firestore, 'sellers', uid);
    const { ...sellerData } = seller;
    await updateDoc(sellerRef, sellerData);
    return seller;
  }

  async delete(id: string): Promise<void> {
    const sellerRef = doc(this.firestore, 'sellers', id);
    await deleteDoc(sellerRef);
  }

  async findBy(field: string, value: any) {
    const sellersRef = collection(this.firestore, 'sellers');
    const q = query(sellersRef, where(field, '==', value));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getSellerByCode(code: string): Promise<ISeller | null> {
    const sellersRef = collection(this.firestore, 'sellers');
    const q = query(sellersRef, where('code', '==', code));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as ISeller;
  }
  async getSellersByCodeOrName(codeOrName: string): Promise<ISeller[]> {
    const sellersRef = collection(this.firestore, 'sellers');
    const q = query(
      sellersRef,
      where('code', '>=', codeOrName),
      where('code', '<', codeOrName + '\uf8ff')
    );
    const q2 = query(
      sellersRef,
      where('name', '>=', codeOrName),
      where('name', '<', codeOrName + '\uf8ff')
    );
    const [codeSnapshot, nameSnapshot] = await Promise.all([getDocs(q), getDocs(q2)]);
    // Unir resultados y eliminar duplicados por id
    const sellersMap = new Map<string, ISeller>();
    codeSnapshot.docs.forEach(doc => sellersMap.set(doc.id, { id: doc.id, ...doc.data() } as ISeller));
    nameSnapshot.docs.forEach(doc => sellersMap.set(doc.id, { id: doc.id, ...doc.data() } as ISeller));
    return Array.from(sellersMap.values());
  }
  async updateState(id: string, state: boolean, updatedBy: AuthUser): Promise<ISeller> {
    const sellerRef = doc(this.firestore, 'sellers', id);
    await updateDoc(sellerRef, { state, updatedAt: new Date().valueOf(), updatedBy });
    const updatedSnap = await getDoc(sellerRef);
    if (!updatedSnap.exists()) {
      throw new Error('Seller not found');
    }
    return { id: updatedSnap.id, ...updatedSnap.data() } as ISeller;
  }
  async getSellerByPagination(
    pageIndex: number,
    pageSize: number,
    queries?: { [key: string]: string }[],
  ): Promise<ISeller[]> {
    const sellerRef = collection(this.firestore, 'sellers');
    const zeroBasedPageIndex = pageIndex - 1;
    const constraints: QueryConstraint[] = [];

    if (queries) {
      for (const [field, value] of Object.entries(queries)) {
        constraints.push(where(field, '==', value));
      }
    }

    constraints.push(orderBy('createdAt', 'desc'));

    if (zeroBasedPageIndex === 0) {
      // Primera página
      const q = query(
        sellerRef,
        ...constraints,
        limit(pageSize)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      } as ISeller));
    } else {
      // Para páginas posteriores, obtener el cursor correcto
      const cursorQuery = query(
        sellerRef,
        ...constraints,
        limit(zeroBasedPageIndex * pageSize)
      );
      const cursorSnapshot = await getDocs(cursorQuery);
      const docs = cursorSnapshot.docs;
      if (docs.length < zeroBasedPageIndex * pageSize) {
        return [];
      }
      const lastDoc = docs[docs.length - 1];
      const pageQuery = query(
        sellerRef,
        ...constraints,
        startAfter(lastDoc),
        limit(pageSize)
      );
      const pageSnapshot = await getDocs(pageQuery);
      return pageSnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      } as ISeller));
    }
  }

  async getTotalItems(queries?: { [key: string]: string }[]): Promise<number> {
    const sellersRef = collection(this.firestore, 'sellers');
    const constraints: QueryConstraint[] = [];
    if (queries) {
      for (const [field, value] of Object.entries(queries)) {
        constraints.push(where(field, '==', value));
      }
    }
    const q = query(sellersRef, ...constraints);
    const countSnapshot = await getCountFromServer(q);
    return countSnapshot.data().count;
  }

  async getSellersActive(): Promise<ISeller[]> {
    const sellersRef = collection(this.firestore, 'sellers');
    const q = query(sellersRef, where('state', '==', true));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ISeller));
  }
}
