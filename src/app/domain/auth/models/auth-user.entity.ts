import { User } from '@angular/fire/auth';

export interface AuthUser extends Partial<User> {
  name?: string;
  isAdmin?: boolean;
}
