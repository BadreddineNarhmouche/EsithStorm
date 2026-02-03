import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TechnicienService } from '../../../core/services/technicien.service';
import { Technicien } from '../../../shared/models/technicien.model';
import { ToastService } from '../../../shared/services/toast.service';
import { downloadCsv } from '../../../shared/utils/csv-export.util';

type SortKey = keyof Technicien | '';

@Component({
  selector: 'app-technicien-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './technicien-list.component.html',
  styleUrls: ['./technicien-list.component.scss'],
})
export class TechnicienListComponent implements OnInit {
  list: Technicien[] = [];
  loading = true;
  search = '';
  disponibilite = '';
  competences = '';
  sortColumn: SortKey = '';
  sortAsc = true;
  showForm = false;
  editing: Technicien | null = null;
  form: Technicien = this.emptyForm();
  error = '';
  submitting = false;

  constructor(private api: TechnicienService, private toast: ToastService) {}

  get sortedList(): Technicien[] {
    if (!this.sortColumn) return this.list;
    const key = this.sortColumn;
    return [...this.list].sort((a, b) => {
      const va = a[key as keyof Technicien];
      const vb = b[key as keyof Technicien];
      const cmp = String(va ?? '').localeCompare(String(vb ?? ''), 'fr');
      return this.sortAsc ? cmp : -cmp;
    });
  }

  sortBy(col: SortKey): void {
    if (this.sortColumn === col) this.sortAsc = !this.sortAsc;
    else { this.sortColumn = col; this.sortAsc = true; }
  }

  exportCsv(): void {
    const data = this.sortedList.map(t => ({
      nom: t.nom,
      prenom: t.prenom,
      competences: t.competences,
      experienceAnnees: t.experienceAnnees,
      disponibilite: t.disponibilite,
      email: t.email,
    }));
    downloadCsv(data, 'techniciens.csv');
    this.toast.success('Export CSV téléchargé.');
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.getAll(
      this.search || undefined,
      this.disponibilite || undefined,
      this.competences || undefined
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

  openEdit(t: Technicien): void {
    this.editing = { ...t };
    this.form = { ...t };
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
        this.toast.success(wasEdit ? 'Technicien modifié.' : 'Technicien ajouté.');
      },
      error: () => {
        this.error = 'Erreur lors de l\'enregistrement.';
        this.submitting = false;
        this.toast.error('Erreur lors de l\'enregistrement.');
      },
    });
  }

  delete(t: Technicien): void {
    if (!t.id || !confirm('Supprimer ce technicien ?')) return;
    this.api.delete(t.id).subscribe({
      next: () => {
        this.load();
        this.toast.success('Technicien supprimé.');
      },
      error: () => {
        this.error = 'Erreur lors de la suppression.';
        this.toast.error('Erreur lors de la suppression.');
      },
    });
  }

  private emptyForm(): Technicien {
    return { nom: '', prenom: '', competences: '', disponibilite: 'LIBRE', email: '' };
  }
}
