import { Timestamp } from '@angular/fire/firestore';

export interface UserData {
  uid?: string;
  name: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  state?: boolean;
  createdAt: Timestamp;
  creator: { name: string; id: string };
  updatedAt: Timestamp;
  updater: { name: string; id: string };
}
