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
    query,
    setDoc,
    updateDoc,
    where,
} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class FirebasePaymentParameterizationAdapter
    implements PaymentParameterizationServicePort {
    constructor(private firestore: Firestore) { }

    async getByUid(uid: string): Promise<PaymentParameterization> {
        const payment = await getDoc(doc(this.firestore, 'payment-parameterization', uid));
        if (!payment.exists()) throw new Error('Pago no encontrado');
        return payment.data() as PaymentParameterization;
    }

    async create(
        data: PaymentParameterization
    ): Promise<PaymentParameterization> {
        const uid = data.uid || `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const docRef = doc(collection(this.firestore, 'payment-parameterization'), uid);
        const dataWithId = { ...data, uid };
        return setDoc(docRef, dataWithId).then(() => dataWithId);
    }

    async update(
        uid: string,
        data: Partial<PaymentParameterization>
    ): Promise<PaymentParameterization> {
        const docRef = doc(
            collection(this.firestore, 'payment-parameterization'),
            uid
        );
        const { uid: _, ...dataWithoutId } = data;
        return updateDoc(docRef, dataWithoutId).then(() => data);
    }

    async deactivate(uid: string): Promise<void> {
        await updateDoc(doc(this.firestore, 'payment-parameterization', uid), { state: false });
    }

    async delete(uid: string): Promise<void> {
        await deleteDoc(doc(this.firestore, 'payment-parameterization', uid));
    }

    async getAll(): Promise<PaymentParameterization[]> {
        const querySnapshot = await getDocs(collection(this.firestore, 'payment-parameterization'));
        return querySnapshot.docs.map(
            (doc) => doc.data() as PaymentParameterization
        );
    }

    async getPaymentParameterizationByValue(
        amount: number | string | undefined,
        digits?: number | undefined,
        combined?: boolean | undefined
    ): Promise<PaymentParameterization | null> {
        const collectionRef = collection(this.firestore, 'payment-parameterization');
        let q = query(collectionRef, where('amount', '==', amount), where('digits', '==', digits), where('combined', '==', combined));
        return getDocs(q).then((snapshot) => {
            if (snapshot.empty) return null;
            const doc = snapshot.docs[0];
            return { id: doc.id, ...doc.data() } as PaymentParameterization;
        });
    }
}
