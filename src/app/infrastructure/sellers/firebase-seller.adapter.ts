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
    const sellerRef = doc(this.firestore, 'sellers', seller.uid);
    await setDoc(sellerRef, seller);
    return seller;
  }

  async update(uid: string, seller: ISeller): Promise<ISeller> {
    const sellerRef = doc(this.firestore, 'sellers', uid);
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
}
