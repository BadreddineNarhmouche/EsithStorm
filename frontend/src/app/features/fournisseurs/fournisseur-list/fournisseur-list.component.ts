import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FournisseurService } from '../../../core/services/fournisseur.service';
import { Fournisseur } from '../../../shared/models/fournisseur.model';
import { ToastService } from '../../../shared/services/toast.service';
import { downloadCsv } from '../../../shared/utils/csv-export.util';

type SortKey = keyof Fournisseur | '';

@Component({
  selector: 'app-fournisseur-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fournisseur-list.component.html',
  styleUrls: ['./fournisseur-list.component.scss'],
})
export class FournisseurListComponent implements OnInit {
  list: Fournisseur[] = [];
  loading = true;
  search = '';
  pays = '';
  ville = '';
  matieres = '';
  sortColumn: SortKey = '';
  sortAsc = true;
  showForm = false;
  editing: Fournisseur | null = null;
  form: Fournisseur = this.emptyForm();
  error = '';
  submitting = false;

  constructor(private api: FournisseurService, private toast: ToastService) {}

  get sortedList(): Fournisseur[] {
    if (!this.sortColumn) return this.list;
    const key = this.sortColumn;
    return [...this.list].sort((a, b) => {
      const va = a[key as keyof Fournisseur];
      const vb = b[key as keyof Fournisseur];
      const cmp = String(va ?? '').localeCompare(String(vb ?? ''), 'fr');
      return this.sortAsc ? cmp : -cmp;
    });
  }

  sortBy(col: SortKey): void {
    if (this.sortColumn === col) this.sortAsc = !this.sortAsc;
    else { this.sortColumn = col; this.sortAsc = true; }
  }

  exportCsv(): void {
    const data = this.sortedList.map(f => ({
      nom: f.nom,
      matieresPremieres: f.matieresPremieres,
      delaiJours: f.delaiJours,
      ville: f.ville,
      pays: f.pays,
      email: f.email,
    }));
    downloadCsv(data, 'fournisseurs.csv');
    this.toast.success('Export CSV téléchargé.');
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.getAll(
      this.search || undefined,
      this.pays || undefined,
      this.ville || undefined,
      this.matieres || undefined
    ).subscribe({
      next: (data) => {
        this.list = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement.';
        this.loading = false;
      },
    });
  }

  openAdd(): void {
    this.editing = null;
    this.form = this.emptyForm();
    this.showForm = true;
    this.error = '';
  }

  openEdit(f: Fournisseur): void {
    this.editing = { ...f };
    this.form = { ...f };
    this.showForm = true;
    this.error = '';
  }

  closeForm(): void {
    this.showForm = false;
    this.editing = null;
  }

  save(): void {
    if (!this.form.nom?.trim()) {
      this.error = 'Le nom est obligatoire.';
      return;
    }
    this.submitting = true;
    this.error = '';
    const req = this.editing
      ? this.api.update(this.editing.id!, this.form)
      : this.api.create(this.form);
    const wasEdit = !!this.editing;
    req.subscribe({
      next: () => {
        this.closeForm();
        this.load();
        this.submitting = false;
        this.toast.success(wasEdit ? 'Fournisseur modifié.' : 'Fournisseur ajouté.');
      },
      error: () => {
        this.error = 'Erreur lors de l\'enregistrement.';
        this.submitting = false;
        this.toast.error('Erreur lors de l\'enregistrement.');
      },
    });
  }

  delete(f: Fournisseur): void {
    if (!f.id || !confirm('Supprimer ce fournisseur ?')) return;
    this.api.delete(f.id).subscribe({
      next: () => {
        this.load();
        this.toast.success('Fournisseur supprimé.');
      },
      error: () => {
        this.error = 'Erreur lors de la suppression.';
        this.toast.error('Erreur lors de la suppression.');
      },
    });
  }

  private emptyForm(): Fournisseur {
    return { nom: '', matieresPremieres: '', ville: '', pays: '', email: '' };
  }
}
