import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AuthService } from '../core/services/auth.service';
import { ApiService } from '../core/services/api.service';
import { DEMO_MODE } from '../core/demo-mode';
import { ToastComponent } from '../shared/components/toast/toast.component';

export interface SearchResult {
  type: string;
  id: number;
  label: string;
  route: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, RouterOutlet, ToastComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  isDemo = DEMO_MODE;
  searchQuery = '';
  searchResults: SearchResult[] = [];
  showSearchDropdown = false;
  private search$ = new Subject<string>();

  constructor(
    public auth: AuthService,
    private api: ApiService,
    private router: Router,
  ) {
    this.search$.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(q => this.api.globalSearch(q)),
    ).subscribe(results => {
      this.searchResults = results;
      this.showSearchDropdown = results.length > 0;
    });
  }

  onSearchInput(): void {
    const q = this.searchQuery.trim();
    if (!q) {
      this.searchResults = [];
      this.showSearchDropdown = false;
      return;
    }
    this.search$.next(q);
  }

  goToResult(r: SearchResult): void {
    this.router.navigate([r.route]);
    this.searchQuery = '';
    this.searchResults = [];
    this.showSearchDropdown = false;
  }

  closeSearch(): void {
    setTimeout(() => (this.showSearchDropdown = false), 150);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.showSearchDropdown = false;
  }
}
