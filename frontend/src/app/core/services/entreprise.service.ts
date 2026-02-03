import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Entreprise } from '../../shared/models/entreprise.model';
import { DEMO_MODE } from '../demo-mode';
import { DemoDataService } from './demo-data.service';

@Injectable({ providedIn: 'root' })
export class EntrepriseService {
  private base = `${environment.apiUrl}/entreprises`;

  constructor(private http: HttpClient, private demo: DemoDataService) {}

  getAll(search?: string, pays?: string, specialite?: string): Observable<Entreprise[]> {
    if (DEMO_MODE) return of(this.demo.getEntreprisesFiltered(search, pays, specialite));
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (pays) params = params.set('pays', pays);
    if (specialite) params = params.set('specialite', specialite);
    return this.http.get<Entreprise[]>(this.base, { params });
  }

  getById(id: number): Observable<Entreprise> {
    if (DEMO_MODE) {
      const e = this.demo.getEntreprises().find(x => x.id === id);
      return e ? of(e) : of(null as any);
    }
    return this.http.get<Entreprise>(`${this.base}/${id}`);
  }

  create(e: Entreprise): Observable<Entreprise> {
    if (DEMO_MODE) return of(this.demo.addEntreprise(e));
    return this.http.post<Entreprise>(this.base, e);
  }

  update(id: number, e: Entreprise): Observable<Entreprise> {
    if (DEMO_MODE) return of(this.demo.updateEntreprise(id, e)!);
    return this.http.put<Entreprise>(`${this.base}/${id}`, e);
  }

  delete(id: number): Observable<void> {
    if (DEMO_MODE) { this.demo.deleteEntreprise(id); return of(void 0); }
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
