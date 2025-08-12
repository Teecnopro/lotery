import { Timestamp } from '@angular/fire/firestore';
import { AuthUser } from '../../auth/models/auth-user.entity';
import { WhereCondition } from '../../../shared/models/query.entity';

export interface RegisterBetsDetail {
  _id?: string
  uid?: string;
  lotteryNumber?: string;
  lottery?: { id: string; name: string };
  seller?: { id: string; name: string; code: string };
  value?: number;
  combined?: boolean;
  warning?: boolean;
  date?: Date;
  createdAt?: Date;
  creator?: AuthUser | null;
  updatedAt?: Date;
  updater?: AuthUser | null;
  alertDescription?: string | undefined | null;
}

export interface RegisterBets {
  _id?: string;
  uid?: string;
  lotteryNumber?: string;
  lottery?: { id: string; name: string };
  groupedValue?: number;
  combined?: boolean;
  warning?: boolean;
  alertDescription?: string | undefined | null;
  date?: Date;
  updatedAt?: Date;
}

export interface ListBets {
  date: Date;
  lottery: any;
  whereConditions?: WhereCondition;
  resetFilter?: boolean;
  resume?: boolean;
  view: string[];
  returnView?: 'resume' | 'detail';
}

export interface ViewDetail {
  detail: boolean;
  item?: RegisterBets;
  sellerId?: string;
  isSeller?: boolean;
}
