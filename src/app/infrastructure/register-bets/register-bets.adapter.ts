import { inject, Injectable, OnInit } from '@angular/core';

import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  Firestore,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  or,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  setDoc,
  startAfter,
  startAt,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from '@angular/fire/firestore';
import { RegisterBetsServicePort } from '../../domain/register-bets/ports';
import {
  ListBets,
  RegisterBets,
  RegisterBetsDetail,
} from '../../domain/register-bets/models/register-bets.entity';
import { FirebaseQuery, ResponseQuery } from '../../shared/models/query.entity';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertParameterization } from '../../domain/alert-parameterization/models/alert-parameterization.entity';
import { IQueryBetsByVendor } from '../../modules/reports/interface/IReports.interface';

@Injectable({ providedIn: 'root' })
export class FirebaseRegisterBetsAdapter implements RegisterBetsServicePort {
  private betsSubject: BehaviorSubject<ListBets | null> =
    new BehaviorSubject<ListBets | null>(null);

  private tope = 12000;
  private pageSize = 25;

  // Pagination
  history: QueryDocumentSnapshot<DocumentData>[] = [];
  currentIndex = -1;
  alertList: AlertParameterization[] = [];
  private hasNext = false;

  constructor(private firestore: Firestore) {
    this.getAlerts();
  }

  listBets$(): Observable<ListBets | null> | null {
    return this.betsSubject.asObservable();
  }

  updateList$(data: ListBets) {
    return this.betsSubject.next(data);
  }

  async create(data: RegisterBetsDetail): Promise<void> {
    this.getAlerts();
    const warning = this.validateAlert(
      data.lotteryNumber!,
      data.value as number,
      data.combined as boolean
    );

    data.warning = warning.isAlert;
    data.alertDescription = warning.description || '';

    const bets = collection(this.firestore, 'register-bets-detail');
    await addDoc(bets, {
      ...data,
    });

    const total = await this.grupedTotalValue(data);
    await this.createGroupedBets(data, total);
  }

  async delete(data: RegisterBetsDetail[]): Promise<void> {
    let totalSumary = this.totalToDelete(data);

    const batch = writeBatch(this.firestore);

    const ids = data.map((item) => item.uid);

    ids.forEach((id) => {
      const ref = doc(this.firestore, `register-bets-detail/${id}`);
      batch.delete(ref);
    });

    await batch.commit();

    await this.deleteOrUpdateGroupedBets(data[0], totalSumary);
  }

  totalToDelete(data: RegisterBetsDetail[]) {
    let sumary = 0;

    data.forEach((item) => {
      sumary += item.value as number;
    });

    return sumary;
  }

  async deleteOrUpdateGroupedBets(data: RegisterBets, total: number) {
    const betsRef = collection(this.firestore, 'register-bets');

    const q = this.queryBase(data, betsRef);

    const bet = (await getDocs(q)).docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as RegisterBets),
    }));

    if (bet.length === 0) {
      throw new Error('No existen apuestas agrupadas');
    }

    const totalDiff = (bet[0].groupedValue as number) - total;

    const warning = this.validateAlert(data.lotteryNumber!, totalDiff, data.combined as boolean);

    if (totalDiff > 0) {
      await updateDoc(doc(this.firestore, 'register-bets', bet[0].id), {
        updatedAt: data.updatedAt,
        groupedValue: totalDiff,
        warning: warning.isAlert,
        alertDescription: warning.description || '',
      });
      return;
    }

    await deleteDoc(doc(this.firestore, 'register-bets', bet[0].id));
  }

  async getByQuery({
    direction,
    whereConditions,
    pageSize,
  }: FirebaseQuery): Promise<ResponseQuery<RegisterBets>> {
    const betRef = collection(this.firestore, 'register-bets');

    if (direction === 'reset') {
      this.currentIndex = -1;
      this.history = [];
    }

    // Aplicando filtros
    const constraints: QueryConstraint[] = [];

    for (const [field, op, value] of whereConditions!) {
      constraints.push(where(field, op, value));
    }

    constraints.push(orderBy('updatedAt', 'desc'));
    constraints.push(orderBy('warning', 'desc'));

    const cursor = this.history[this.currentIndex] ?? undefined;

    let q;

    if (direction === 'next' && cursor) {
      constraints.push(startAfter(cursor));
    } else if (direction === 'prev' && this.currentIndex > 0) {
      const prevCursor = this.history[this.currentIndex - 2]; // retrocede 2 posiciones para obtener la anterior
      prevCursor ? constraints.push(startAfter(prevCursor)) : null;
      this.currentIndex -= 2; // retrocede manualmente
    }

    constraints.push(limit(pageSize || this.pageSize));

    q = query(betRef, ...constraints);

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(
      (doc) => ({ uid: doc.id, ...doc.data() } as RegisterBets)
    );

    // Actualizar historial y cursor
    if (snapshot.docs.length > 0) {
      this.currentIndex++;
      this.history[this.currentIndex] = snapshot.docs[snapshot.docs.length - 1];
    }

    this.hasNext = snapshot.docs.length === (pageSize || this.pageSize);

    return { data, hasNext: this.hasNext, hasPrev: this.currentIndex > 0 };
  }

  async getTotalBets({
    whereConditions,
    bd = 'register-bets',
  }: FirebaseQuery): Promise<number> {
    const betRef = collection(this.firestore, bd);

    // Aplicando filtros
    const constraints: QueryConstraint[] = [];

    for (const [field, op, value] of whereConditions!) {
      constraints.push(where(field, op, value));
    }

    const q = query(betRef, ...constraints);

    const snapshot = await getCountFromServer(q);

    return snapshot.data().count;
  }

  async getByQueryDetail({
    direction,
    whereConditions,
    pageSize,
  }: FirebaseQuery): Promise<ResponseQuery<RegisterBetsDetail>> {
    const betRef = collection(this.firestore, 'register-bets-detail');

    if (direction === 'reset') {
      this.currentIndex = -1;
      this.history = [];
    }

    // Aplicando filtros
    const constraints: QueryConstraint[] = [];

    for (const [field, op, value] of whereConditions!) {
      constraints.push(where(field, op, value));
    }

    constraints.push(orderBy('updatedAt', 'desc'));

    const cursor = this.history[this.currentIndex] ?? undefined;

    let q;

    if (direction === 'next' && cursor) {
      constraints.push(startAfter(cursor));
    } else if (direction === 'prev' && this.currentIndex > 0) {
      const prevCursor = this.history[this.currentIndex - 2]; // retrocede 2 posiciones para obtener la anterior
      prevCursor ? constraints.push(startAfter(prevCursor)) : null;
      this.currentIndex -= 2; // retrocede manualmente
    }

    constraints.push(limit(pageSize || this.pageSize));

    q = query(betRef, ...constraints);

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(
      (doc) => ({ uid: doc.id, ...doc.data() } as RegisterBetsDetail)
    );

    // Actualizar historial y cursor
    if (snapshot.docs.length > 0) {
      this.currentIndex++;
      this.history[this.currentIndex] = snapshot.docs[snapshot.docs.length - 1];
    }

    this.hasNext = snapshot.docs.length === (pageSize || this.pageSize);

    return { data, hasNext: this.hasNext, hasPrev: this.currentIndex > 0 };
  }

  async getByUid(uid: string): Promise<RegisterBets> {
    const payment = await getDoc(doc(this.firestore, 'register-bets', uid));
    if (!payment.exists()) throw new Error('Pago no encontrado');
    return payment.data() as RegisterBets;
  }

  async grupedTotalValue(data: RegisterBetsDetail) {
    const betsRef = collection(this.firestore, 'register-bets-detail');

    const q = this.queryBase(data, betsRef);

    const details = await getDocs(q);

    let sumary = 0;

    details.docs.forEach((doc) => {
      const data = doc.data() as RegisterBetsDetail;
      sumary += data.value as number;
    });

    return sumary;
  }

  async createGroupedBets(
    data: RegisterBetsDetail,
    total: number
  ): Promise<void> {
    const warning = this.validateAlert(data.lotteryNumber!, total, data.combined);

    const dataGroupedBets: RegisterBets = {
      lotteryNumber: data.lotteryNumber,
      lottery: data.lottery,
      groupedValue: total,
      combined: data.combined,
      warning: warning.isAlert,
      alertDescription: warning.description || '',
      date: data.date,
      updatedAt: data.updatedAt,
    };

    const betsRef = collection(this.firestore, 'register-bets');

    const q = this.queryBase(data, betsRef);

    const bet = (await getDocs(q)).docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (bet.length > 0) {
      await updateDoc(doc(this.firestore, 'register-bets', bet[0].id), {
        updatedAt: data.updatedAt,
        groupedValue: total,
        warning: warning.isAlert,
        alertDescription: warning.description || '',
      });
      return;
    }

    await addDoc(betsRef, {
      ...dataGroupedBets,
    });
  }

  queryBase(
    data: RegisterBetsDetail | RegisterBets,
    ref: CollectionReference<DocumentData, DocumentData>
  ) {
    return query(
      ref,
      where('lotteryNumber', '==', data.lotteryNumber),
      where('date', '==', data.date),
      where('lottery.id', '==', data.lottery?.id),
      where('combined', '==', data.combined)
    );
  }

  async getDataToResume({ whereConditions }: FirebaseQuery): Promise<any> {
    const betRefDetail = collection(this.firestore, 'register-bets-detail');
    const betRef = collection(this.firestore, 'register-bets');

    // Aplicando filtros
    const constraints: QueryConstraint[] = [];

    for (const [field, op, value] of whereConditions!) {
      constraints.push(where(field, op, value));
    }

    const qDetail = query(betRefDetail, ...constraints);
    const q = query(betRef, ...constraints, where('warning', '==', true));

    const snapshotDetail = await getDocs(qDetail);
    const snapshot = await getDocs(q);

    const dataDetail = snapshotDetail.docs.map(
      (doc) => ({ uid: doc.id, ...doc.data() } as RegisterBetsDetail)
    );
    const dataGrouped = snapshot.docs.map(
      (doc) => ({ uid: doc.id, ...doc.data() } as RegisterBets)
    );

    return this.parseDataToResume(dataDetail, dataGrouped);
  }

  parseDataToResume(data: RegisterBetsDetail[], dataGrouped: RegisterBets[]) {
    let objParse: any = {};

    for (let item of data) {
      if (objParse[item?.lottery?.name as string]) continue;

      // Filtrar por lotería
      const lotteryFiltered = data.filter(
        (bet) => bet?.lottery?.name === item.lottery?.name
      );

      objParse[item?.lottery?.name as string] =
        this.getTotalResume(lotteryFiltered);
    }

    objParse['Total'] = this.getTotalResume(data);
    objParse['Advertencias'] = this.getTotalResumeWarning(dataGrouped);
    objParse['Comisiones (55%)'] = {
      totalData: undefined,
      cont: Math.round(
        (objParse['Total']?.cont - objParse['Advertencias']?.cont) * 0.55
      ),
    };

    return objParse;
  }

  getTotalResume(data: RegisterBetsDetail[]) {
    let cont = 0;
    for (let item of data) {
      cont += item.value as number;
    }

    return { cont, totalData: data.length };
  }

  getTotalResumeWarning(data: RegisterBets[]) {
    let cont = 0;
    for (let item of data) {
      cont += item.groupedValue as number;
    }

    return { cont, totalData: data.length };
  }

  async getAlerts() {
    const alerts = localStorage.getItem('alertDataSource');
    this.alertList = alerts ? JSON.parse(alerts) : [];
  }

  validateAlert(lotteryNumber: string, groupedValue: number, combined: boolean = false) {
    if (!this.alertList || this.alertList.length === 0)
      return { isAlert: false, description: 'No hay alertas disponibles' };

    const alert = this.alertList.find(
      (alert) =>
        groupedValue > alert.value! && alert.digits === lotteryNumber?.length && alert.combined === combined
    );
    return { isAlert: !!alert, description: alert?.description } as {
      isAlert: boolean;
      description: string;
    };
  }

  async getBetsByPagination(
    pageIndex: number,
    pageSize: number,
    queries?: { [key: string]: string }[]
  ): Promise<RegisterBetsDetail[]> {
    const betRef = collection(this.firestore, 'register-bets-detail');
    const zeroBasedPageIndex = pageIndex - 1;
    const constraints: QueryConstraint[] =
      queries && queries.length > 0 ? this.returnQueries(queries) : [];
    if (queries && queries.length > 0) {
      const q = query(betRef, ...constraints, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) =>
          ({
            uid: doc.id,
            ...doc.data(),
          } as RegisterBetsDetail)
      );
    }

    constraints.push(orderBy('date', 'desc'));
    if (zeroBasedPageIndex === 0) {
      // Primera página
      const q = query(betRef, ...constraints, limit(pageSize));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) =>
          ({
            uid: doc.id,
            ...doc.data(),
          } as RegisterBetsDetail)
      );
    } else {
      // Para páginas posteriores, obtener el cursor correcto
      const cursorQuery = query(
        betRef,
        ...constraints,
        limit(zeroBasedPageIndex * pageSize)
      );
      const cursorSnapshot = await getDocs(cursorQuery);
      const docs = cursorSnapshot.docs;
      if (docs.length < zeroBasedPageIndex * pageSize) {
        return [];
      }
      const lastDoc = docs[docs.length - 1];
      const pageQuery = query(
        betRef,
        ...constraints,
        startAfter(lastDoc),
        limit(pageSize)
      );
      const pageSnapshot = await getDocs(pageQuery);
      return pageSnapshot.docs.map(
        (doc) =>
          ({
            uid: doc.id,
            ...doc.data(),
          } as RegisterBetsDetail)
      );
    }
  }

  async getTotalBetsQueries(
    queries?: { [key: string]: string }[]
  ): Promise<number> {
    const betRef = collection(this.firestore, 'register-bets-detail');
    const constraints: QueryConstraint[] =
      queries && queries.length > 0 ? this.returnQueries(queries) : [];
    const q = query(betRef, ...constraints);
    const countSnapshot = await getCountFromServer(q);
    return countSnapshot.data().count;
  }

  returnQueries(queries: { [key: string]: string }[]): QueryConstraint[] {
    const constraints: QueryConstraint[] = [];
    const fields = ['date', 'lottery.id', 'lotteryNumber'];
    for (const field of fields) {
      let value = queries.find((q) => q[field])!;
      if (field === 'date') {
        const date = new Date(`${value[field]}T00:00:00`);
        constraints.push(where(field, '>=', Timestamp.fromDate(date)));
      } else if (field === 'lotteryNumber') {
        let lotteryNumberQueries = [];
        let copyValue = value[field];
        let copyValueDuplicate = value[field];
        lotteryNumberQueries.push(copyValue);
        for (let i = 0; i < value[field].length; i++) {
          const query = copyValue.slice(i + 1);
          if (query.length !== 0) {
            lotteryNumberQueries.push(query);
          }
        }
        for (let i = copyValueDuplicate.length - 1; i > 0; i--) {
          const trimmed = copyValueDuplicate.substring(0, i);
          lotteryNumberQueries.push(trimmed);
        }
        if (value[field].length >= 3 && value[field].length <= 4) {
          const combinations = this.permute(value[field]);
          combinations.forEach((comb) => {
            lotteryNumberQueries.push(comb);
          });
        }
        // Eliminar números duplicados de lotteryNumberQueries
        lotteryNumberQueries = Array.from(new Set(lotteryNumberQueries));
        constraints.push(where('lotteryNumber', 'in', lotteryNumberQueries));
      } else {
        constraints.push(where(field, '==', value[field]));
      }
    }
    return constraints;
  }

  permute(str: string): string[] {
    const results = new Set<string>();
    function generate(arr: string[], l: number, r: number) {
      if (l === r) {
        results.add(arr.join(''));
      } else {
        for (let i = l; i <= r; i++) {
          [arr[l], arr[i]] = [arr[i], arr[l]]; // swap
          generate([...arr], l + 1, r); // llamada recursiva con copia del array
          // No es necesario deshacer el swap por usar copia [...arr]
        }
      }
    }
    generate(str.split(''), 0, str.length - 1);
    return Array.from(results);
  }

  async getBetsToListResume({
    whereConditions,
  }: FirebaseQuery): Promise<Map<string, IQueryBetsByVendor>> {
    const refBd = collection(this.firestore, 'register-bets-detail');

    // Aplicando filtros
    const constraints: QueryConstraint[] = [];

    for (const [field, op, value] of whereConditions!) {
      constraints.push(where(field, op, value));
    }

    const queryBets = query(refBd, ...constraints);

    const snapshot = await getDocs(queryBets);
    const betsByVendor = new Map<string, IQueryBetsByVendor>();

    snapshot?.forEach((doc) => {
      const data = doc.data();
      const seller = data?.['seller'];

      const value = data?.['value'] ?? 0;
      const sellerId = seller?.['id'];

      if (!sellerId) return;

      if (!betsByVendor.has(sellerId)) {
        betsByVendor.set(sellerId, {
          name: seller?.['name'],
          code: seller?.['code'],
          value: 0,
        });
      }

      betsByVendor.get(sellerId)!.value += value;
    });

    return betsByVendor;
  }
}
