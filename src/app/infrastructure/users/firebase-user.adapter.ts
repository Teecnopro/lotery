import { Injectable } from '@angular/core';

import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  setDoc,
  Timestamp,
  updateDoc,
} from '@angular/fire/firestore';

import { UserServicePort } from '../../domain/users/ports';
import { UserData } from '../../domain/users/models/users.entity';
import { FirebaseError } from '@angular/fire/app';

@Injectable({ providedIn: 'root' })
export class FirebaseUserAdapter implements UserServicePort {
  constructor(private auth: Auth, private firestore: Firestore) {}

  async getByUid(uid: string): Promise<UserData> {
    const userDoc = await getDoc(doc(this.firestore, 'users', uid));
    if (!userDoc.exists())
      throw new FirebaseError('auth/user-not-found', 'Perfil no encontrado');
    return userDoc.data() as UserData;
  }

  async create(
    user: Omit<UserData, 'uid' | 'state'>,
    password: string
  ): Promise<void> {
    const result = await createUserWithEmailAndPassword(
      this.auth,
      user.email,
      password
    );
    const uid = result?.user?.uid;
    const userDoc = doc(this.firestore, 'users', uid);
    await setDoc(userDoc, {
      ...user,
      uid,
      state: true,
    });
  }

  async update(uid: string, data: Partial<UserData>): Promise<void> {
    await updateDoc(doc(this.firestore, 'users', uid), data);
  }

  async changeState(
    uid: string,
    newState: boolean,
    updatedAt: Timestamp,
    updater: { name: string; id: string }
  ): Promise<void> {
    await updateDoc(doc(this.firestore, 'users', uid), {
      state: newState,
      updatedAt,
      updater,
    });
  }

  async delete(uid: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'users', uid));
  }

  async getAll(): Promise<UserData[]> {
    const querySnapshot = await getDocs(collection(this.firestore, 'users'));
    return querySnapshot.docs.map((doc) => doc.data() as UserData);
  }
}
