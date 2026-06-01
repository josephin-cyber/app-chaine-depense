import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transfert, Beneficiaire, Banque } from './models/transfert.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://ugly-cobra-86.loca.lt';
  //private apiUrl = 'http://localhost:3001/api';

  //1. On cree l'entête requise pour contourner la page de localtunnel
  private headers = new HttpHeaders({
    'bypass-tunnel-reminder': 'true'
  });

  constructor(private http: HttpClient) { }

  //2. On applique ces headers sur les fonctions de récupération des données

  getTransferts(): Observable<Transfert[]> {
    return this.http.get<Transfert[]>(`${this.apiUrl}/transferts`, { headers: this.headers } );
  }

  getBeneficiaires(): Observable<Beneficiaire[]> {
    return this.http.get<Beneficiaire[]>(`${this.apiUrl}/beneficiaires`, { headers: this.headers } );
  }

  getBanques(): Observable<Banque[]> {
    return this.http.get<Banque[]>(`${this.apiUrl}/banques`, { headers: this.headers } );
  }

  addTransfert(transfert: Omit<Transfert, 'id'>): Observable<Transfert> {
    return this.http.post<Transfert>(`${this.apiUrl}/transferts`, transfert, { headers: this.headers });
  }
}