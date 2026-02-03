import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Technicien } from '../../shared/models/technicien.model';
import { DEMO_MODE } from '../demo-mode';
import { DemoDataService } from './demo-data.service';

@Injectable({ providedIn: 'root' })
export class TechnicienService {
  private base = `${environment.apiUrl}/techniciens`;

  constructor(private http: HttpClient, private demo: DemoDataService) {}

  getAll(search?: string, disponibilite?: string, competences?: string): Observable<Technicien[]> {
    if (DEMO_MODE) return of(this.demo.getTechniciensFiltered(search, disponibilite, competences));
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (disponibilite) params = params.set('disponibilite', disponibilite);
    if (competences) params = params.set('competences', competences);
    return this.http.get<Technicien[]>(this.base, { params });
  }

  getById(id: number): Observable<Technicien> {
    if (DEMO_MODE) {
      const t = this.demo.getTechniciens().find(x => x.id === id);
      return t ? of(t) : of(null as any);
    }
    return this.http.get<Technicien>(`${this.base}/${id}`);
  }

  create(t: Technicien): Observable<Technicien> {
    if (DEMO_MODE) return of(this.demo.addTechnicien(t));
    return this.http.post<Technicien>(this.base, t);
  }

  update(id: number, t: Technicien): Observable<Technicien> {
    if (DEMO_MODE) return of(this.demo.updateTechnicien(id, t)!);
    return this.http.put<Technicien>(`${this.base}/${id}`, t);
  }

  delete(id: number): Observable<void> {
    if (DEMO_MODE) { this.demo.deleteTechnicien(id); return of(void 0); }
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
