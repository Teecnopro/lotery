import { WhereFilterOp } from "@angular/fire/firestore";
import { WhereCondition } from "../models/query.entity";

export function mapWhereToMongo(where: WhereCondition[]) {
  const opMap: Record<WhereFilterOp, string> = {
    '==': '$eq',
    '!=': '$ne',
    '>': '$gt',
    '>=': '$gte',
    '<': '$lt',
    '<=': '$lte',
    'in': '$in',
    'not-in': '$nin',
    'array-contains': '$in', // o $elemMatch si quieres más control
    'array-contains-any': '$in'
  };

  const query: any = {};

  for (const [field, op, value] of where) {
    const mongoOp = opMap[op];
    if (!mongoOp) throw new Error(`Operador Firestore no soportado: ${op}`);

    if (!query[field]) {
      query[field] = {};
    }

    query[field][mongoOp] = value;
  }

  return query;
}
