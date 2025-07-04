import { DocumentData, QueryDocumentSnapshot } from "@angular/fire/firestore";

type WhereFilterOp = '==' | '<' | '<=' | '>' | '>=' | '!=' | 'array-contains' | 'in' | 'array-contains-any' | 'not-in';
export type WhereCondition = [string, WhereFilterOp, unknown];

export interface FirebaseQuery {
  cursor?: QueryDocumentSnapshot<DocumentData>,
  direction?: 'next' | 'prev' | 'reset',
  whereConditions?: WhereCondition[];
  pageSize?: number;
}

export interface ResponseQuery<T> {
  data: T[],
  docs?: QueryDocumentSnapshot<DocumentData, DocumentData>[],
  hasNext?: boolean;
  hasPrev?: boolean;
}
