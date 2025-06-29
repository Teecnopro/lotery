import { RegisterBets, RegisterBetsDetail } from "../models/register-bets.entity";


export interface RegisterBetsServicePort {
  create(data: RegisterBetsDetail): Promise<void>;
  delete(uid: string): Promise<void>;
  getByQuery(query: any): Promise<RegisterBets[]>;
  getByQueryDetail(query: any): Promise<RegisterBetsDetail[]>;
  getByUid(uid: string): Promise<RegisterBets | null>;
}
