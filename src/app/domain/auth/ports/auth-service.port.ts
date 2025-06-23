import { AuthUser } from '../models/auth-user.entity';

export interface AuthServicePort {
  login(email: string, password: string): Promise<AuthUser>;
  logout(): Promise<void>;
  recoverPassword(email: string): Promise<void>;
}
