import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transfert, Beneficiaire, Banque } from './models/transfert.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3001/api';

  constructor(private http: HttpClient) { }

  getTransferts(): Observable<Transfert[]> {
    return this.http.get<Transfert[]>(`${this.apiUrl}/transferts`);
  }

  getBeneficiaires(): Observable<Beneficiaire[]> {
    return this.http.get<Beneficiaire[]>(`${this.apiUrl}/beneficiaires`);
  }

  getBanques(): Observable<Banque[]> {
    return this.http.get<Banque[]>(`${this.apiUrl}/banques`);
  }

  addTransfert(transfert: Omit<Transfert, 'id'>): Observable<Transfert> {
    return this.http.post<Transfert>(`${this.apiUrl}/transferts`, transfert);
  }
}