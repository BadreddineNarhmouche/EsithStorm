import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DEMO_MODE } from '../demo-mode';
import { DemoDataService } from './demo-data.service';
import { Entreprise } from '../../shared/models/entreprise.model';
import { Fournisseur } from '../../shared/models/fournisseur.model';
import { Atelier } from '../../shared/models/atelier.model';
import { Technicien } from '../../shared/models/technicien.model';
import { Chercheur } from '../../shared/models/chercheur.model';

export interface DashboardStats {
  entreprises: number;
  fournisseurs: number;
  ateliers: number;
  techniciens: number;
  chercheurs: number;
  total: number;
}

export interface DashboardRecent {
  entreprises: Entreprise[];
  fournisseurs: Fournisseur[];
  ateliers: Atelier[];
  techniciens: Technicien[];
  chercheurs: Chercheur[];
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient, private demo: DemoDataService) {}

  getDashboardStats(): Observable<DashboardStats> {
    if (DEMO_MODE) return of(this.demo.getStats());
    return this.http.get<DashboardStats>(`${this.base}/stats/dashboard`);
  }

  getDashboardRecent(limit = 5): Observable<DashboardRecent> {
    if (DEMO_MODE) return of(this.demo.getRecent(limit));
    return of({ entreprises: [], fournisseurs: [], ateliers: [], techniciens: [], chercheurs: [] });
  }

  globalSearch(query: string): Observable<{ type: string; id: number; label: string; route: string }[]> {
    if (DEMO_MODE) return of(this.demo.globalSearch(query));
    return of([]);
  }
}
