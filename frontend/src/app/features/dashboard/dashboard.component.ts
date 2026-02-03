import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, DashboardStats, DashboardRecent } from '../../core/services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  recent: DashboardRecent | null = null;
  loading = true;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger les statistiques.';
        this.loading = false;
      },
    });
    this.api.getDashboardRecent(5).subscribe(data => (this.recent = data));
  }

  getPercent(key: keyof DashboardStats, total: number): number {
    if (!this.stats || typeof this.stats[key] !== 'number' || total === 0) return 0;
    return Math.round(((this.stats[key] as number) / total) * 100);
  }
}
