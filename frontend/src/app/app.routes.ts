import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { EntrepriseListComponent } from './features/entreprises/entreprise-list/entreprise-list.component';
import { FournisseurListComponent } from './features/fournisseurs/fournisseur-list/fournisseur-list.component';
import { AtelierListComponent } from './features/ateliers/atelier-list/atelier-list.component';
import { TechnicienListComponent } from './features/techniciens/technicien-list/technicien-list.component';
import { ChercheurListComponent } from './features/chercheurs/chercheur-list/chercheur-list.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'entreprises', component: EntrepriseListComponent },
      { path: 'fournisseurs', component: FournisseurListComponent },
      { path: 'ateliers', component: AtelierListComponent },
      { path: 'techniciens', component: TechnicienListComponent },
      { path: 'chercheurs', component: ChercheurListComponent },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
