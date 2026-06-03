import { Routes } from '@angular/router';
import { authGuard } from './services/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadComponent: () => import('./components/auth/auth').then(m => m.AuthComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'study/:categoryId',
    loadComponent: () => import('./components/flashcard/flashcard').then(m => m.FlashcardComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/auth' }
];
