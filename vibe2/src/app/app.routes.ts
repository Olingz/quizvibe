import { Routes } from '@angular/router';
import { QuizResultsListComponent } from './components/quiz-results-list/quiz-results-list.component';
import { LoginComponent } from './components/login/login.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { map, take } from 'rxjs/operators';
import { Router } from '@angular/router';

const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.user$.pipe(
    take(1),
    map(user => {
      if (user) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};

export const routes: Routes = [
  {
    path: '',
    component: QuizResultsListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
