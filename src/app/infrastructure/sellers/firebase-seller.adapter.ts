import { Injectable } from '@angular/core';
import { SellerRepositoryPort } from '../../domain/sellers/ports/seller-repository.port';

import {
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
import { ISeller } from '../../domain/sellers/models/seller.model';

@Injectable({ providedIn: 'root' })
export class FirebaseSellerAdapter implements SellerRepositoryPort {
  constructor(private firestore: Firestore) {}
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
    const sellerRef = doc(this.firestore, 'sellers', seller.id);
    await setDoc(sellerRef, seller);
    return seller;
  }

  async update(seller: ISeller): Promise<ISeller> {
    if (!seller.id) {
      throw new Error('Seller id is required for update.');
    }
    const sellerRef = doc(this.firestore, 'sellers', seller.id);
    const { id, ...sellerData } = seller;
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
}
