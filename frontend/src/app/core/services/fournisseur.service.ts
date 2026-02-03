import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Fournisseur } from '../../shared/models/fournisseur.model';
import { DEMO_MODE } from '../demo-mode';
import { DemoDataService } from './demo-data.service';

@Injectable({ providedIn: 'root' })
export class FournisseurService {
  private base = `${environment.apiUrl}/fournisseurs`;

  constructor(private http: HttpClient, private demo: DemoDataService) {}

  getAll(search?: string, pays?: string, ville?: string, matieres?: string): Observable<Fournisseur[]> {
    if (DEMO_MODE) return of(this.demo.getFournisseursFiltered(search, pays, ville, matieres));
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (pays) params = params.set('pays', pays);
    if (ville) params = params.set('ville', ville);
    if (matieres) params = params.set('matieres', matieres);
    return this.http.get<Fournisseur[]>(this.base, { params });
  }

  getById(id: number): Observable<Fournisseur> {
    if (DEMO_MODE) {
      const f = this.demo.getFournisseurs().find(x => x.id === id);
      return f ? of(f) : of(null as any);
    }
    return this.http.get<Fournisseur>(`${this.base}/${id}`);
  }

  create(f: Fournisseur): Observable<Fournisseur> {
    if (DEMO_MODE) return of(this.demo.addFournisseur(f));
    return this.http.post<Fournisseur>(this.base, f);
  }

  update(id: number, f: Fournisseur): Observable<Fournisseur> {
    if (DEMO_MODE) return of(this.demo.updateFournisseur(id, f)!);
    return this.http.put<Fournisseur>(`${this.base}/${id}`, f);
  }

  delete(id: number): Observable<void> {
    if (DEMO_MODE) { this.demo.deleteFournisseur(id); return of(void 0); }
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
