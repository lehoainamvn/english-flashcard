import { Routes } from '@angular/router';
import { authGuard } from './services/auth/auth.guard';
import { adminGuard } from './services/auth/admin.guard';

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
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/admin/admin-layout/admin-layout').then(m => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./components/admin/admin-users/admin-users').then(m => m.AdminUsersComponent)
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./components/admin/admin-categories/admin-categories').then(m => m.AdminCategoriesComponent)
      },
      {
        path: 'words',
        loadComponent: () =>
          import('./components/admin/admin-words/admin-words').then(m => m.AdminWordsComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/auth' }
];
