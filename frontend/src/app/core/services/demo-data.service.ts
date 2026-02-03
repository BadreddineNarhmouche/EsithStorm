import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { Entreprise } from '../../shared/models/entreprise.model';
import { Fournisseur } from '../../shared/models/fournisseur.model';
import { Atelier } from '../../shared/models/atelier.model';
import { Technicien } from '../../shared/models/technicien.model';
import { Chercheur } from '../../shared/models/chercheur.model';

/** Données d'exemple en mémoire pour le mode démo (sans backend). */
@Injectable({ providedIn: 'root' })
export class DemoDataService {
  private nextId = 100;

  private entreprises = new BehaviorSubject<Entreprise[]>([
    { id: 1, nom: 'Textile France SARL', pays: 'France', specialiteTextile: 'Coton, lin', email: 'contact@textile-france.fr', telephone: '+33 1 23 45 67 89' },
    { id: 2, nom: 'Soie Orient', pays: 'Maroc', specialiteTextile: 'Soie, cachemire', email: 'info@soie-orient.ma', telephone: '+212 5 37 12 34 56' },
    { id: 3, nom: 'Laine du Nord', pays: 'France', specialiteTextile: 'Laine, tricot', email: 'contact@laine-nord.fr', telephone: '+33 3 20 00 00 00' },
  ]);
  private fournisseurs = new BehaviorSubject<Fournisseur[]>([
    { id: 1, nom: 'Coton & Co', matieresPremieres: 'Coton bio, coton recyclé', delaiJours: 14, ville: 'Lyon', pays: 'France', email: 'ventes@coton-co.fr' },
    { id: 2, nom: 'Fibres Naturelles', matieresPremieres: 'Lin, chanvre, jute', delaiJours: 21, ville: 'Casablanca', pays: 'Maroc', email: 'contact@fibres-nat.ma' },
    { id: 3, nom: 'Soieries Dupont', matieresPremieres: 'Soie naturelle', delaiJours: 30, ville: 'Lyon', pays: 'France', email: 'info@soieries-dupont.fr' },
  ]);
  private ateliers = new BehaviorSubject<Atelier[]>([
    { id: 1, nom: 'Atelier Tissage Nord', typeProduction: 'Tissage', capacite: '500 m/jour', equipements: 'Métiers à tisser, teinture', ville: 'Lille', pays: 'France' },
    { id: 2, nom: 'Confection Sud', typeProduction: 'Confection', capacite: '200 pièces/jour', equipements: 'Surjeteuses, brodeuses', ville: 'Marseille', pays: 'France' },
    { id: 3, nom: 'Teinture Express', typeProduction: 'Teinture', capacite: '1 t/jour', equipements: 'Bains de teinture, séchage', ville: 'Lyon', pays: 'France' },
  ]);
  private techniciens = new BehaviorSubject<Technicien[]>([
    { id: 1, nom: 'Dupont', prenom: 'Jean', competences: 'Tissage, maintenance', experienceAnnees: 8, disponibilite: 'LIBRE', email: 'j.dupont@email.fr' },
    { id: 2, nom: 'Martin', prenom: 'Sophie', competences: 'Teinture, contrôle qualité', experienceAnnees: 5, disponibilite: 'OCCUPE', email: 's.martin@email.fr' },
    { id: 3, nom: 'Bernard', prenom: 'Luc', competences: 'Confection, patronnage', experienceAnnees: 12, disponibilite: 'LIBRE', email: 'l.bernard@email.fr' },
  ]);
  private chercheurs = new BehaviorSubject<Chercheur[]>([
    { id: 1, nom: 'Bernard', prenom: 'Pierre', domainesRecherche: 'Textiles techniques, biocomposites', materiauxEtudies: 'Fibres naturelles, polymères', publications: 'Revue Textile 2023', email: 'p.bernard@labo.fr' },
    { id: 2, nom: 'Leroy', prenom: 'Marie', domainesRecherche: 'Teintures naturelles, durabilité', materiauxEtudies: 'Indigo, cochenille, mordants', publications: 'Conf. Eco-Textile 2024', email: 'm.leroy@labo.fr' },
    { id: 3, nom: 'Petit', prenom: 'Anne', domainesRecherche: 'Recyclage textile', materiauxEtudies: 'Polyester, coton recyclé', publications: 'Thèse 2024', email: 'a.petit@labo.fr' },
  ]);

  getEntreprises(): Entreprise[] { return this.entreprises.value; }
  getFournisseurs(): Fournisseur[] { return this.fournisseurs.value; }
  getAteliers(): Atelier[] { return this.ateliers.value; }
  getTechniciens(): Technicien[] { return this.techniciens.value; }
  getChercheurs(): Chercheur[] { return this.chercheurs.value; }

  private filter<T>(list: T[], search: string, ...fields: (keyof T)[]): T[] {
    if (!search?.trim()) return list;
    const s = search.toLowerCase();
    return list.filter(item => fields.some(f => String(item[f] ?? '').toLowerCase().includes(s)));
  }

  // --- Entreprises ---
  getEntreprisesFiltered(search?: string, pays?: string, specialite?: string): Entreprise[] {
    let list = this.entreprises.value;
    if (search) list = this.filter(list, search, 'nom', 'email');
    if (pays) list = list.filter(e => e.pays?.toLowerCase() === pays.toLowerCase());
    if (specialite) list = list.filter(e => e.specialiteTextile?.toLowerCase().includes(specialite.toLowerCase()));
    return list;
  }
  addEntreprise(e: Entreprise): Entreprise {
    const newE = { ...e, id: ++this.nextId };
    this.entreprises.next([...this.entreprises.value, newE]);
    return newE;
  }
  updateEntreprise(id: number, e: Entreprise): Entreprise | null {
    const list = this.entreprises.value;
    const i = list.findIndex(x => x.id === id);
    if (i === -1) return null;
    const updated = { ...e, id };
    list[i] = updated;
    this.entreprises.next([...list]);
    return updated;
  }
  deleteEntreprise(id: number): void {
    this.entreprises.next(this.entreprises.value.filter(x => x.id !== id));
  }

  // --- Fournisseurs ---
  getFournisseursFiltered(search?: string, pays?: string, ville?: string, matieres?: string): Fournisseur[] {
    let list = this.fournisseurs.value;
    if (search) list = this.filter(list, search, 'nom', 'email');
    if (pays) list = list.filter(f => f.pays?.toLowerCase() === pays.toLowerCase());
    if (ville) list = list.filter(f => f.ville?.toLowerCase().includes(ville.toLowerCase()));
    if (matieres) list = list.filter(f => f.matieresPremieres?.toLowerCase().includes(matieres.toLowerCase()));
    return list;
  }
  addFournisseur(f: Fournisseur): Fournisseur {
    const newF = { ...f, id: ++this.nextId };
    this.fournisseurs.next([...this.fournisseurs.value, newF]);
    return newF;
  }
  updateFournisseur(id: number, f: Fournisseur): Fournisseur | null {
    const list = this.fournisseurs.value;
    const i = list.findIndex(x => x.id === id);
    if (i === -1) return null;
    const updated = { ...f, id };
    list[i] = updated;
    this.fournisseurs.next([...list]);
    return updated;
  }
  deleteFournisseur(id: number): void {
    this.fournisseurs.next(this.fournisseurs.value.filter(x => x.id !== id));
  }

  // --- Ateliers ---
  getAteliersFiltered(search?: string, pays?: string, typeProduction?: string): Atelier[] {
    let list = this.ateliers.value;
    if (search) list = this.filter(list, search, 'nom', 'equipements');
    if (pays) list = list.filter(a => a.pays?.toLowerCase() === pays.toLowerCase());
    if (typeProduction) list = list.filter(a => a.typeProduction?.toLowerCase().includes(typeProduction.toLowerCase()));
    return list;
  }
  addAtelier(a: Atelier): Atelier {
    const newA = { ...a, id: ++this.nextId };
    this.ateliers.next([...this.ateliers.value, newA]);
    return newA;
  }
  updateAtelier(id: number, a: Atelier): Atelier | null {
    const list = this.ateliers.value;
    const i = list.findIndex(x => x.id === id);
    if (i === -1) return null;
    const updated = { ...a, id };
    list[i] = updated;
    this.ateliers.next([...list]);
    return updated;
  }
  deleteAtelier(id: number): void {
    this.ateliers.next(this.ateliers.value.filter(x => x.id !== id));
  }

  // --- Techniciens ---
  getTechniciensFiltered(search?: string, disponibilite?: string, competences?: string): Technicien[] {
    let list = this.techniciens.value;
    if (search) list = this.filter(list, search, 'nom', 'prenom', 'email');
    if (disponibilite) list = list.filter(t => t.disponibilite?.toLowerCase() === disponibilite.toLowerCase());
    if (competences) list = list.filter(t => t.competences?.toLowerCase().includes(competences.toLowerCase()));
    return list;
  }
  addTechnicien(t: Technicien): Technicien {
    const newT = { ...t, id: ++this.nextId };
    this.techniciens.next([...this.techniciens.value, newT]);
    return newT;
  }
  updateTechnicien(id: number, t: Technicien): Technicien | null {
    const list = this.techniciens.value;
    const i = list.findIndex(x => x.id === id);
    if (i === -1) return null;
    const updated = { ...t, id };
    list[i] = updated;
    this.techniciens.next([...list]);
    return updated;
  }
  deleteTechnicien(id: number): void {
    this.techniciens.next(this.techniciens.value.filter(x => x.id !== id));
  }

  // --- Chercheurs ---
  getChercheursFiltered(search?: string, domaines?: string, materiaux?: string): Chercheur[] {
    let list = this.chercheurs.value;
    if (search) list = this.filter(list, search, 'nom', 'prenom', 'email');
    if (domaines) list = list.filter(c => c.domainesRecherche?.toLowerCase().includes(domaines.toLowerCase()));
    if (materiaux) list = list.filter(c => c.materiauxEtudies?.toLowerCase().includes(materiaux.toLowerCase()));
    return list;
  }
  addChercheur(c: Chercheur): Chercheur {
    const newC = { ...c, id: ++this.nextId };
    this.chercheurs.next([...this.chercheurs.value, newC]);
    return newC;
  }
  updateChercheur(id: number, c: Chercheur): Chercheur | null {
    const list = this.chercheurs.value;
    const i = list.findIndex(x => x.id === id);
    if (i === -1) return null;
    const updated = { ...c, id };
    list[i] = updated;
    this.chercheurs.next([...list]);
    return updated;
  }
  deleteChercheur(id: number): void {
    this.chercheurs.next(this.chercheurs.value.filter(x => x.id !== id));
  }

  getStats(): { entreprises: number; fournisseurs: number; ateliers: number; techniciens: number; chercheurs: number; total: number } {
    const e = this.entreprises.value.length;
    const f = this.fournisseurs.value.length;
    const a = this.ateliers.value.length;
    const t = this.techniciens.value.length;
    const c = this.chercheurs.value.length;
    return { entreprises: e, fournisseurs: f, ateliers: a, techniciens: t, chercheurs: c, total: e + f + a + t + c };
  }

  /** Derniers enregistrements par type (ordre d'ajout = fin de liste). */
  getRecent(limit = 5): {
    entreprises: Entreprise[];
    fournisseurs: Fournisseur[];
    ateliers: Atelier[];
    techniciens: Technicien[];
    chercheurs: Chercheur[];
  } {
    const take = (arr: unknown[]) => arr.slice(-limit);
    return {
      entreprises: take(this.entreprises.value) as Entreprise[],
      fournisseurs: take(this.fournisseurs.value) as Fournisseur[],
      ateliers: take(this.ateliers.value) as Atelier[],
      techniciens: take(this.techniciens.value) as Technicien[],
      chercheurs: take(this.chercheurs.value) as Chercheur[],
    };
  }

  /** Recherche globale : retourne des entrées { type, id, label, route }. */
  globalSearch(q: string): { type: string; id: number; label: string; route: string }[] {
    const s = (q ?? '').trim().toLowerCase();
    if (!s) return [];
    const out: { type: string; id: number; label: string; route: string }[] = [];
    this.entreprises.value.forEach(e => {
      if (String(e.nom ?? '').toLowerCase().includes(s) || String(e.email ?? '').toLowerCase().includes(s)) {
        out.push({ type: 'Entreprise', id: e.id!, label: e.nom, route: '/entreprises' });
      }
    });
    this.fournisseurs.value.forEach(f => {
      if (String(f.nom ?? '').toLowerCase().includes(s) || String(f.email ?? '').toLowerCase().includes(s)) {
        out.push({ type: 'Fournisseur', id: f.id!, label: f.nom, route: '/fournisseurs' });
      }
    });
    this.ateliers.value.forEach(a => {
      if (String(a.nom ?? '').toLowerCase().includes(s)) {
        out.push({ type: 'Atelier', id: a.id!, label: a.nom, route: '/ateliers' });
      }
    });
    this.techniciens.value.forEach(t => {
      const full = `${t.nom ?? ''} ${t.prenom ?? ''}`.toLowerCase();
      if (full.includes(s) || String(t.email ?? '').toLowerCase().includes(s)) {
        out.push({ type: 'Technicien', id: t.id!, label: `${t.nom} ${t.prenom}`.trim(), route: '/techniciens' });
      }
    });
    this.chercheurs.value.forEach(c => {
      const full = `${c.nom ?? ''} ${c.prenom ?? ''}`.toLowerCase();
      if (full.includes(s) || String(c.email ?? '').toLowerCase().includes(s)) {
        out.push({ type: 'Chercheur', id: c.id!, label: `${c.nom} ${c.prenom}`.trim(), route: '/chercheurs' });
      }
    });
    return out.slice(0, 15);
  }
}
