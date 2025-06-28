import { inject, Injectable } from '@angular/core';

import { PaymentParameterizationServicePort } from '../../domain/payment-parameterization/ports/payment-parameterization.port';
import { PaymentParameterization } from '../../domain/payment-parameterization/models/payment-parameterization.entity';

import {
    collection,
    deleteDoc,
    doc,
    Firestore,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
} from '@angular/fire/firestore';
@Injectable({ providedIn: 'root' })
export class FirebasePaymentParameterizationAdapter implements PaymentParameterizationServicePort {
    constructor(private firestore: Firestore) { }
    createPaymentParameterization(data: PaymentParameterization): Promise<PaymentParameterization> {
        const docRef = doc(collection(this.firestore, 'payment-parameterizations'));
        return setDoc(docRef, data).then(() => data);
    }
    updatePaymentParameterization(id: string, data: PaymentParameterization): Promise<PaymentParameterization> {
        const docRef = doc(collection(this.firestore, 'payment-parameterizations'), id);
        // Remove 'id' property before updating Firestore document
        const { uid: _id, ...dataWithoutId } = data;
        return updateDoc(docRef, dataWithoutId).then(() => data);
    }
    deletePaymentParameterization(id: string): Promise<void> {
        const docRef = doc(collection(this.firestore, 'payment-parameterizations'), id);
        return deleteDoc(docRef);
    }
    getPaymentParameterization(id: string): Promise<PaymentParameterization | null> {
        const docRef = doc(collection(this.firestore, 'payment-parameterizations'), id);
        return getDoc(docRef).then((doc) => (doc.exists() ? (doc.data() as PaymentParameterization) : null));
    }
    listPaymentParameterizations(): Promise<PaymentParameterization[]> {
        const collectionRef = collection(this.firestore, 'payment-parameterizations');
        return getDocs(collectionRef).then((snapshot) => {
            return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as PaymentParameterization));
        });
    }
}