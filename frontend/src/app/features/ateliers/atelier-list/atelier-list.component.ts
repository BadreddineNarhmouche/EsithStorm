import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AtelierService } from '../../../core/services/atelier.service';
import { Atelier } from '../../../shared/models/atelier.model';
import { ToastService } from '../../../shared/services/toast.service';
import { downloadCsv } from '../../../shared/utils/csv-export.util';

type SortKey = keyof Atelier | '';

@Component({
  selector: 'app-atelier-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './atelier-list.component.html',
  styleUrls: ['./atelier-list.component.scss'],
})
export class AtelierListComponent implements OnInit {
  list: Atelier[] = [];
  loading = true;
  search = '';
  pays = '';
  typeProduction = '';
  sortColumn: SortKey = '';
  sortAsc = true;
  showForm = false;
  editing: Atelier | null = null;
  form: Atelier = this.emptyForm();
  error = '';
  submitting = false;

  constructor(private api: AtelierService, private toast: ToastService) {}

  get sortedList(): Atelier[] {
    if (!this.sortColumn) return this.list;
    const key = this.sortColumn;
    return [...this.list].sort((a, b) => {
      const va = a[key as keyof Atelier];
      const vb = b[key as keyof Atelier];
      const cmp = String(va ?? '').localeCompare(String(vb ?? ''), 'fr');
      return this.sortAsc ? cmp : -cmp;
    });
  }

  sortBy(col: SortKey): void {
    if (this.sortColumn === col) this.sortAsc = !this.sortAsc;
    else { this.sortColumn = col; this.sortAsc = true; }
  }

  exportCsv(): void {
    const data = this.sortedList.map(a => ({
      nom: a.nom,
      typeProduction: a.typeProduction,
      capacite: a.capacite,
      equipements: a.equipements,
      ville: a.ville,
      pays: a.pays,
    }));
    downloadCsv(data, 'ateliers.csv');
    this.toast.success('Export CSV téléchargé.');
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.getAll(this.search || undefined, this.pays || undefined, this.typeProduction || undefined).subscribe({
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

  openEdit(a: Atelier): void {
    this.editing = { ...a };
    this.form = { ...a };
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
        this.toast.success(wasEdit ? 'Atelier modifié.' : 'Atelier ajouté.');
      },
      error: () => {
        this.error = 'Erreur lors de l\'enregistrement.';
        this.submitting = false;
        this.toast.error('Erreur lors de l\'enregistrement.');
      },
    });
  }

  delete(a: Atelier): void {
    if (!a.id || !confirm('Supprimer cet atelier ?')) return;
    this.api.delete(a.id).subscribe({
      next: () => {
        this.load();
        this.toast.success('Atelier supprimé.');
      },
      error: () => {
        this.error = 'Erreur lors de la suppression.';
        this.toast.error('Erreur lors de la suppression.');
      },
    });
  }

  private emptyForm(): Atelier {
    return { nom: '', typeProduction: '', capacite: '', equipements: '', ville: '', pays: '' };
  }
}
