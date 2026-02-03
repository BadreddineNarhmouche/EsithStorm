import { CanActivateFn } from '@angular/router';

/**
 * Guard : temporairement désactivé pour voir tout le frontend sans login.
 * Remettre la vérification auth pour la prod.
 */
export const authGuard: CanActivateFn = () => true;
