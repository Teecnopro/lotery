import { Timestamp } from '@angular/fire/firestore';

export interface UserData {
  uid: string;
  name: string;
  document: string;
  phone: string;
  email: string;
  isAdmin: boolean;
  state: boolean;
  createdAt: Timestamp;
  /* Es ub */
  creator: { name: string; id: string };
  updatedAt: Timestamp;
  updater: { name: string; id: string };
}
