import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Atelier } from '../../shared/models/atelier.model';
import { DEMO_MODE } from '../demo-mode';
import { DemoDataService } from './demo-data.service';

@Injectable({ providedIn: 'root' })
export class AtelierService {
  private base = `${environment.apiUrl}/ateliers`;

  constructor(private http: HttpClient, private demo: DemoDataService) {}

  getAll(search?: string, pays?: string, typeProduction?: string): Observable<Atelier[]> {
    if (DEMO_MODE) return of(this.demo.getAteliersFiltered(search, pays, typeProduction));
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (pays) params = params.set('pays', pays);
    if (typeProduction) params = params.set('typeProduction', typeProduction);
    return this.http.get<Atelier[]>(this.base, { params });
  }

  getById(id: number): Observable<Atelier> {
    if (DEMO_MODE) {
      const a = this.demo.getAteliers().find(x => x.id === id);
      return a ? of(a) : of(null as any);
    }
    return this.http.get<Atelier>(`${this.base}/${id}`);
  }

  create(a: Atelier): Observable<Atelier> {
    if (DEMO_MODE) return of(this.demo.addAtelier(a));
    return this.http.post<Atelier>(this.base, a);
  }

  update(id: number, a: Atelier): Observable<Atelier> {
    if (DEMO_MODE) return of(this.demo.updateAtelier(id, a)!);
    return this.http.put<Atelier>(`${this.base}/${id}`, a);
  }

  delete(id: number): Observable<void> {
    if (DEMO_MODE) { this.demo.deleteAtelier(id); return of(void 0); }
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
