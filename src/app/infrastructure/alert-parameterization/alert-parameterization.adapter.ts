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
    setDoc,
    updateDoc,
} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class FirebaseAlertParameterizationAdapter
    implements AlertParameterizationServicePort {
    constructor(private firestore: Firestore) { }

    createAlertParameterization(
        data: AlertParameterization
    ): Promise<AlertParameterization> {
        const docRef = doc(collection(this.firestore, 'alert-parameterizations'));
        return setDoc(docRef, data).then(() => data);
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
}
