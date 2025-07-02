import { Injectable } from '@angular/core';
import { SellerRepositoryPort } from '../../domain/sellers/ports/seller-repository.port';

import {
    collection,
    deleteDoc,
    doc,
    Firestore,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    setDoc,
    startAfter,
    startAt,
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
  async updateState(id: string, state: boolean): Promise<ISeller> {
    const sellerRef = doc(this.firestore, 'sellers', id);
    await updateDoc(sellerRef, { state });
    const updatedSnap = await getDoc(sellerRef);
    if (!updatedSnap.exists()) {
      throw new Error('Seller not found');
    }
    return { id: updatedSnap.id, ...updatedSnap.data() } as ISeller;
  }
  async getSellerByPagination(
    pageIndex: number,
    pageSize: number
  ): Promise<ISeller[]> {
    // Validar parámetros de entrada
    if (pageIndex < 1) {
      throw new Error('pageIndex debe ser mayor o igual a 1');
    }
    
    if (pageSize < 1) {
      throw new Error('pageSize debe ser mayor a 0');
    }
    
    const sellersRef = collection(this.firestore, 'sellers');
    
    // Convertir pageIndex de base 1 a base 0 para los cálculos
    const zeroBasedPageIndex = pageIndex - 1;
    
    // Calcular cuántos documentos saltar
    const documentsToSkip = zeroBasedPageIndex * pageSize;
    
    if (documentsToSkip === 0) {
      // Primera página - no necesita offset
      const q = query(
        sellersRef,
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({ 
        uid: doc.id, 
        ...doc.data() 
      } as ISeller));
      
      return results;
    } else {
      // Para páginas posteriores, necesitamos obtener el documento de inicio
      if (documentsToSkip > 0) {
        const startQuery = query(
          sellersRef,
          orderBy('createdAt', 'desc'),
          limit(documentsToSkip)
        );
        const startSnapshot = await getDocs(startQuery);
        
        if (startSnapshot.docs.length < documentsToSkip) {
          return [];
        }
        
        // Obtener el último documento como punto de inicio
        const lastDoc = startSnapshot.docs[startSnapshot.docs.length - 1];
        
        // Consulta para la página actual
        const q = query(
          sellersRef,
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(pageSize)
        );
        
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => ({ 
          uid: doc.id, 
          ...doc.data() 
        } as ISeller));
        
        return results;
      } else {
        // Fallback a primera página
        const q = query(
          sellersRef,
          orderBy('createdAt', 'desc'),
          limit(pageSize)
        );
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => ({ 
          uid: doc.id, 
          ...doc.data() 
        } as ISeller));
        
        return results;
      }
    }
  }

  async getTotalItems(): Promise<number> {
    const sellersRef = collection(this.firestore, 'sellers');
    const querySnapshot = await getDocs(sellersRef);
    return querySnapshot.size;
  }
}
