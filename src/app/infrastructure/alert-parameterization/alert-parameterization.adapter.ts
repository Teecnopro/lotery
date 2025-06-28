import { inject, Injectable } from '@angular/core';

import { AlertParameterizationServicePort } from '../../domain/alert-parameterization/ports/alert-parameterization.port';
import { AlertParameterization } from '../../domain/alert-parameterization/models/alert-parameterization.entity';

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
export class FirebaseAlertParameterizationAdapter
    implements AlertParameterizationServicePort {
    constructor(private firestore: Firestore) { }

    createAlertParameterization(
        data: AlertParameterization
    ): Promise<AlertParameterization> {
        // Use provided uid or generate one
        const uid = data.uid || `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const docRef = doc(collection(this.firestore, 'alert-parameterizations'), uid);
        const dataWithId = { ...data, uid };
        return setDoc(docRef, dataWithId).then(() => dataWithId);
    }
    updateAlertParameterization(
        id: string,
        data: AlertParameterization
    ): Promise<AlertParameterization> {
        const docRef = doc(
            collection(this.firestore, 'alert-parameterizations'),
            id
        );
        // Exclude 'id' from the data before updating
        const { uid: _, ...dataWithoutId } = data;
        return updateDoc(docRef, dataWithoutId).then(() => data);
    }
    deleteAlertParameterization(id: string): Promise<void> {
        const docRef = doc(
            collection(this.firestore, 'alert-parameterizations'),
            id
        );
        return deleteDoc(docRef);
    }
    getAlertParameterization(id: string): Promise<AlertParameterization | null> {
        const docRef = doc(
            collection(this.firestore, 'alert-parameterizations'),
            id
        );
        return getDoc(docRef).then((doc) => {
            if (!doc.exists()) return null;
            const data = doc.data() as Omit<AlertParameterization, 'id'>;
            return { id: doc.id, ...data } as AlertParameterization;
        });
    }
    listAlertParameterizations(): Promise<AlertParameterization[]> {
        const collectionRef = collection(this.firestore, 'alert-parameterizations');
        return getDocs(collectionRef).then((snapshot) =>
            snapshot.docs.map(
                (doc) => ({ id: doc.id, ...doc.data() } as AlertParameterization)
            )
        );
    }

    getAlertParameterizationByValue(
        value: number | string | undefined,
        digits?: number | undefined
    ): Promise<AlertParameterization | null> {
        const collectionRef = collection(this.firestore, 'alert-parameterizations');
        let q = query(collectionRef, where('value', '==', value), where('digits', '==', digits));
        return getDocs(q).then((snapshot) => {
            if (snapshot.empty) return null;
            const doc = snapshot.docs[0];
            return { id: doc.id, ...doc.data() } as AlertParameterization;
        });
    }
}
