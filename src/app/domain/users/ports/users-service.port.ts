import { Timestamp } from '@angular/fire/firestore';

import { UserData } from '../models/users.entity';

export abstract class UserServicePort {
  abstract create(
    user: Omit<UserData, 'uid' | 'state'>,
    password: string
  ): Promise<void>;
  abstract update(uid: string, data: Partial<UserData>): Promise<void>;
  abstract changeState(
    uid: string,
    newState: boolean,
    updatedAt: Timestamp,
    updater: { name: string; id: string }
  ): Promise<void>;
  abstract delete(uid: string): Promise<void>;
  abstract getAll(): Promise<UserData[]>;
  abstract getByUid(uid: string): Promise<UserData>;
}
