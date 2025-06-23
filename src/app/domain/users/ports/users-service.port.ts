import { UserData } from '../models/users.entity';

export abstract class UserServicePort {
  abstract create(
    user: Omit<UserData, 'uid' | 'state'>,
    password: string
  ): Promise<void>;
  abstract update(uid: string, data: Partial<UserData>): Promise<void>;
  abstract deactivate(uid: string): Promise<void>;
  abstract delete(uid: string): Promise<void>;
  abstract getAll(): Promise<UserData[]>;
}
