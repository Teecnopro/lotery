import { AuthModule } from '../auth/auth.module';
import { DeleteBetsModule } from '../delete-bets/delete-bets.module';
import { RegisterBetsModule } from '../register-bets/register-bets.module';
import { ReportsModule } from '../reports/reports.module';
import { UserModule } from '../users/user.module';

export const NAME_MODULES = [
  AuthModule,
  UserModule,
  RegisterBetsModule,
  ReportsModule,
  DeleteBetsModule
];
