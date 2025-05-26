import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./team-selection/team-selection.component').then(m => m.TeamSelectionComponent)
  },
  {
    path: '404',
    loadComponent: () => import('./page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent)
  },
  { path: '**', redirectTo: '404' }
];
