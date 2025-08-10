import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
    providedIn: 'root'
})
export class servicesApi {
    private readonly baseUrl = environment.api;

    constructor(private http: HttpClient) {}

    // Método genérico para GET
    get<T>(controller: string, params?: any): Observable<T> {
        return this.http.get<T>(`${this.baseUrl}${controller}`, { params });
    }

    // Método genérico para POST
    post<T>(controller: string, body: any): Observable<T> {
        return this.http.post<T>(`${this.baseUrl}${controller}`, body);
    }

    // Método genérico para PUT
    put<T>(controller: string, body: any): Observable<T> {
        return this.http.put<T>(`${this.baseUrl}${controller}`, body);
    }

    // Método genérico para DELETE
    delete<T>(controller: string, params?: any): Observable<T> {
        return this.http.delete<T>(`${this.baseUrl}${controller}`, { params });
    }
}