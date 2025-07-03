import { Timestamp } from "@angular/fire/firestore";
import { AuthUser } from "../../auth/models/auth-user.entity";
import { WhereCondition } from "../../../shared/models/query.entity";

export interface RegisterBetsDetail {
  uid?: string;
  lotteryNumber?: string;
  lottery?: { id: string; name: string };
  seller?: { id: string; name: string };
  value?: number;
  combined?: boolean;
  warning?: boolean;
  date?: Timestamp;
  createdAt?: Timestamp;
  creator?: AuthUser | null;
  updatedAt?: Timestamp;
  updater?: AuthUser | null;
}

export interface RegisterBets {
  uid?: string;
  lotteryNumber?: string;
  lottery?: { id: string; name: string };
  groupedValue?: number;
  combined?: boolean;
  warning?: boolean;
  alertDescription: string | undefined | null
  date?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ListBets {
  date: Timestamp,
  lottery: any;
  whereConditions?: WhereCondition;
  resetFilter?: boolean;
}
