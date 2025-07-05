import { addDoc, collection, Firestore, getDocs, limit, orderBy, query, QueryConstraint, startAfter, where } from "@angular/fire/firestore";
import { LogBook } from "../../domain/logBook/models/logBook.entity";
import { LogBookServicePort } from "../../domain/logBook/ports";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class LogBookAdapter implements LogBookServicePort {
    constructor(private firestore: Firestore) { }

    async createLogBook(data: LogBook): Promise<LogBook> {
        const docRef = await addDoc(collection(this.firestore, "logbooks"), data);
        return { uid: docRef.id, ...data };
    }

    async listLogBooksByPagination(
        pageSize: number,
        pageIndex: number,
        queries?: { [key: string]: string }[]
    ): Promise<LogBook[]> {
        const sellerRef = collection(this.firestore, 'logbooks');
        const zeroBasedPageIndex = pageIndex - 1;
        const constraints: QueryConstraint[] = [];
        if (queries) {
            for (const [field, value] of Object.entries(queries)) {
                constraints.push(where(field, '==', value));
            }
        }
        constraints.push(orderBy('date', 'desc'));
        if (zeroBasedPageIndex === 0) {
            // Primera página
            const q = query(
                sellerRef,
                ...constraints,
                limit(pageSize)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                uid: doc.id,
                ...doc.data()
            } as LogBook));
        } else {
            // Para páginas posteriores, obtener el cursor correcto
            const cursorQuery = query(
                sellerRef,
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
                sellerRef,
                ...constraints,
                startAfter(lastDoc),
                limit(pageSize)
            );
            const pageSnapshot = await getDocs(pageQuery);
            return pageSnapshot.docs.map(doc => ({
                uid: doc.id,
                ...doc.data()
            } as LogBook));
        }
    }
}