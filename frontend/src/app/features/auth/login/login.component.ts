import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.error = '';
    if (!this.username.trim() || !this.password) {
      this.error = 'Veuillez saisir un identifiant et un mot de passe.';
      return;
    }
    this.loading = true;
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        if (res?.token) {
          this.router.navigate(['/dashboard']);
        } else {
          this.error = 'Identifiants incorrects.';
        }
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        if (err.status === 0 || err.error instanceof ProgressEvent) {
          this.error = 'L\'API ne répond pas. Démarrez le backend Java (voir README) puis réessayez.';
        } else if (err.status === 401) {
          this.error = 'Identifiants incorrects. Vérifiez le nom d\'utilisateur et le mot de passe.';
        } else {
          this.error = 'Erreur de connexion (' + (err.status || 'réseau') + ').';
        }
      },
    });
  }
}
