import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntrepriseService } from '../../../core/services/entreprise.service';
import { Entreprise } from '../../../shared/models/entreprise.model';
import { ToastService } from '../../../shared/services/toast.service';
import { downloadCsv } from '../../../shared/utils/csv-export.util';

type SortKey = keyof Entreprise | '';

@Component({
  selector: 'app-entreprise-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entreprise-list.component.html',
  styleUrls: ['./entreprise-list.component.scss'],
})
export class EntrepriseListComponent implements OnInit {
  list: Entreprise[] = [];
  loading = true;
  search = '';
  pays = '';
  specialite = '';
  showForm = false;
  editing: Entreprise | null = null;
  form: Entreprise = this.emptyForm();
  error = '';
  submitting = false;
  sortColumn: SortKey = '';
  sortAsc = true;

  constructor(private api: EntrepriseService, private toast: ToastService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.getAll(this.search || undefined, this.pays || undefined, this.specialite || undefined).subscribe({
      next: (data) => {
        this.list = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement.';
        this.toast.error('Erreur lors du chargement.');
        this.loading = false;
      },
    });
  }

  get sortedList(): Entreprise[] {
    if (!this.sortColumn) return this.list;
    const key = this.sortColumn;
    return [...this.list].sort((a, b) => {
      const va = a[key as keyof Entreprise];
      const vb = b[key as keyof Entreprise];
      const cmp = String(va ?? '').localeCompare(String(vb ?? ''), 'fr');
      return this.sortAsc ? cmp : -cmp;
    });
  }

  sortBy(col: SortKey): void {
    if (this.sortColumn === col) this.sortAsc = !this.sortAsc;
    else { this.sortColumn = col; this.sortAsc = true; }
  }

  exportCsv(): void {
    const data = this.list.map(e => ({
      nom: e.nom,
      pays: e.pays,
      specialite: e.specialiteTextile,
      email: e.email,
      telephone: e.telephone,
    }));
    downloadCsv(data, 'entreprises.csv');
    this.toast.success('Export CSV téléchargé.');
  }

  openAdd(): void {
    this.editing = null;
    this.form = this.emptyForm();
    this.showForm = true;
    this.error = '';
  }

  openEdit(e: Entreprise): void {
    this.editing = { ...e };
    this.form = { ...e };
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
    req.subscribe({
      next: () => {
        this.closeForm();
        this.load();
        this.submitting = false;
        this.toast.success(this.editing ? 'Entreprise modifiée.' : 'Entreprise créée.');
      },
      error: () => {
        this.error = 'Erreur lors de l\'enregistrement.';
        this.toast.error('Erreur lors de l\'enregistrement.');
        this.submitting = false;
      },
    });
  }

  delete(e: Entreprise): void {
    if (!e.id || !confirm('Supprimer cette entreprise ?')) return;
    this.api.delete(e.id).subscribe({
      next: () => { this.load(); this.toast.success('Entreprise supprimée.'); },
      error: () => { this.error = 'Erreur lors de la suppression.'; this.toast.error('Erreur lors de la suppression.'); },
    });
  }

  private emptyForm(): Entreprise {
    return { nom: '', pays: '', specialiteTextile: '', email: '', telephone: '' };
  }
}
