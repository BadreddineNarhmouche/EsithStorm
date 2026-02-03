import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChercheurService } from '../../../core/services/chercheur.service';
import { Chercheur } from '../../../shared/models/chercheur.model';
import { ToastService } from '../../../shared/services/toast.service';
import { downloadCsv } from '../../../shared/utils/csv-export.util';

type SortKey = keyof Chercheur | '';

@Component({
  selector: 'app-chercheur-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chercheur-list.component.html',
  styleUrls: ['./chercheur-list.component.scss'],
})
export class ChercheurListComponent implements OnInit {
  list: Chercheur[] = [];
  loading = true;
  search = '';
  domaines = '';
  materiaux = '';
  sortColumn: SortKey = '';
  sortAsc = true;
  showForm = false;
  editing: Chercheur | null = null;
  form: Chercheur = this.emptyForm();
  error = '';
  submitting = false;

  constructor(private api: ChercheurService, private toast: ToastService) {}

  get sortedList(): Chercheur[] {
    if (!this.sortColumn) return this.list;
    const key = this.sortColumn;
    return [...this.list].sort((a, b) => {
      const va = a[key as keyof Chercheur];
      const vb = b[key as keyof Chercheur];
      const cmp = String(va ?? '').localeCompare(String(vb ?? ''), 'fr');
      return this.sortAsc ? cmp : -cmp;
    });
  }

  sortBy(col: SortKey): void {
    if (this.sortColumn === col) this.sortAsc = !this.sortAsc;
    else { this.sortColumn = col; this.sortAsc = true; }
  }

  exportCsv(): void {
    const data = this.sortedList.map(c => ({
      nom: c.nom,
      prenom: c.prenom,
      domainesRecherche: c.domainesRecherche,
      materiauxEtudies: c.materiauxEtudies,
      publications: c.publications,
      email: c.email,
    }));
    downloadCsv(data, 'chercheurs.csv');
    this.toast.success('Export CSV téléchargé.');
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.getAll(
      this.search || undefined,
      this.domaines || undefined,
      this.materiaux || undefined
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

  openEdit(c: Chercheur): void {
    this.editing = { ...c };
    this.form = { ...c };
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
        this.toast.success(wasEdit ? 'Chercheur modifié.' : 'Chercheur ajouté.');
      },
      error: () => {
        this.error = 'Erreur lors de l\'enregistrement.';
        this.submitting = false;
        this.toast.error('Erreur lors de l\'enregistrement.');
      },
    });
  }

  delete(c: Chercheur): void {
    if (!c.id || !confirm('Supprimer ce chercheur ?')) return;
    this.api.delete(c.id).subscribe({
      next: () => {
        this.load();
        this.toast.success('Chercheur supprimé.');
      },
      error: () => {
        this.error = 'Erreur lors de la suppression.';
        this.toast.error('Erreur lors de la suppression.');
      },
    });
  }

  private emptyForm(): Chercheur {
    return { nom: '', prenom: '', domainesRecherche: '', materiauxEtudies: '', publications: '', email: '' };
  }
}
