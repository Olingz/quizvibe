import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { QuizResultsListComponent } from './components/quiz-results-list/quiz-results-list.component';
import { LoginComponent } from './components/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    QuizResultsListComponent,
    LoginComponent
  ],
  template: `
    <div class="app-container">
      <header>
        <h1>Quiz Results Tracker</h1>
        <div class="auth-controls" *ngIf="authService.isAuthenticated()">
          <button (click)="logout()">Logout</button>
        </div>
      </header>

      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    
    header {
      background-color: white;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    h1 {
      margin: 0;
      color: #333;
    }
    
    .auth-controls {
      display: flex;
      gap: 1rem;
    }
    
    button {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
    
    button:hover {
      background-color: #c82333;
    }
    
    main {
      padding: 2rem;
    }
  `]
})
export class AppComponent {
  title = 'Quiz Results Tracker';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    // Redirect to login if not authenticated
    this.authService.user$.subscribe(user => {
      if (!user && !this.router.url.includes('login')) {
        this.router.navigate(['/login']);
      }
    });
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
