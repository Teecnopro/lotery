import { FirebaseQuery, ResponseQuery } from "../../../shared/models/query.entity";
import { RegisterBets, RegisterBetsDetail } from "../models/register-bets.entity";


export interface RegisterBetsServicePort {
  create(data: RegisterBetsDetail): Promise<void>;
  delete(uid: string): Promise<void>;
  getByQuery(query: FirebaseQuery): Promise<ResponseQuery<RegisterBets>>;
  getByQueryDetail(query: FirebaseQuery): Promise<ResponseQuery<RegisterBetsDetail>>;
  getByUid(uid: string): Promise<RegisterBets | null>;
}
