import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Chercheur } from '../../shared/models/chercheur.model';
import { DEMO_MODE } from '../demo-mode';
import { DemoDataService } from './demo-data.service';

@Injectable({ providedIn: 'root' })
export class ChercheurService {
  private base = `${environment.apiUrl}/chercheurs`;

  constructor(private http: HttpClient, private demo: DemoDataService) {}

  getAll(search?: string, domaines?: string, materiaux?: string): Observable<Chercheur[]> {
    if (DEMO_MODE) return of(this.demo.getChercheursFiltered(search, domaines, materiaux));
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (domaines) params = params.set('domaines', domaines);
    if (materiaux) params = params.set('materiaux', materiaux);
    return this.http.get<Chercheur[]>(this.base, { params });
  }

  getById(id: number): Observable<Chercheur> {
    if (DEMO_MODE) {
      const c = this.demo.getChercheurs().find(x => x.id === id);
      return c ? of(c) : of(null as any);
    }
    return this.http.get<Chercheur>(`${this.base}/${id}`);
  }

  create(c: Chercheur): Observable<Chercheur> {
    if (DEMO_MODE) return of(this.demo.addChercheur(c));
    return this.http.post<Chercheur>(this.base, c);
  }

  update(id: number, c: Chercheur): Observable<Chercheur> {
    if (DEMO_MODE) return of(this.demo.updateChercheur(id, c)!);
    return this.http.put<Chercheur>(`${this.base}/${id}`, c);
  }

  delete(id: number): Observable<void> {
    if (DEMO_MODE) { this.demo.deleteChercheur(id); return of(void 0); }
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
