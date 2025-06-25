import { Injectable } from '@angular/core';

import {
  Auth,
  createUserWithEmailAndPassword,
  deleteUser,
} from '@angular/fire/auth';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';

import { UserServicePort } from '../../domain/users/ports';
import { UserData } from '../../domain/users/models/users.entity';

@Injectable({ providedIn: 'root' })
export class FirebaseUserAdapter implements UserServicePort {
  /* TODO: Cambiar a Cloud Firestore */
  constructor(private auth: Auth, private firestore: Firestore) {}

  async create(
    user: Omit<UserData, 'uid' | 'state'>,
    password: string
  ): Promise<void> {
    const result = await createUserWithEmailAndPassword(
      this.auth,
      user.email,
      password
    );
    console.log({ result });
    const uid = result?.user?.uid;
    const userDoc = doc(this.firestore, 'users', uid);
    await setDoc(userDoc, {
      ...user,
      uid,
      state: 'active',
    });
  }

  async update(uid: string, data: Partial<UserData>): Promise<void> {
    await updateDoc(doc(this.firestore, 'users', uid), data);
  }

  async deactivate(uid: string): Promise<void> {
    await updateDoc(doc(this.firestore, 'users', uid), { state: 'inactive' });
  }

  async delete(uid: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'users', uid));
    /* TODO: Revisar si requiere permisos...si no solo desactivar eliminarlo del doc
    y si no existe no dejarlo ingresarlo */
    /* const user = await obtenerUsuarioporID pendienteeee(uid);
    await deleteUser(user); */
  }

  async getAll(): Promise<UserData[]> {
    const querySnapshot = await getDocs(collection(this.firestore, 'users'));
    return querySnapshot.docs.map((doc) => doc.data() as UserData);
  }
}
