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
        <div class="header-content">
          <h1>Jonas and Olviers DR Quiz Tracker</h1>
          <div class="auth-controls" *ngIf="authService.isAuthenticated()">
            <button (click)="logout()">Logout</button>
          </div>
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
      background-color: #f8f9fa;
    }
    
    header {
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      padding: 1.2rem 2rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      position: sticky;
      top: 0;
      z-index: 100;
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }
    
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    h1 {
      margin: 0;
      color: #1a1a1a;
      font-size: 1.6rem;
      font-weight: 700;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .auth-controls {
      display: flex;
      gap: 1rem;
    }
    
    button {
      background: linear-gradient(135deg, #4a6cf7 0%, #2541b2 100%);
      color: white;
      border: none;
      padding: 0.5rem 1.2rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(74, 108, 247, 0.2);
    }
    
    button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(74, 108, 247, 0.3);
    }
    
    main {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      header {
        padding: 1rem;
      }
      
      .header-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
      
      h1 {
        font-size: 1.4rem;
      }
    }
  `]
})
export class AppComponent {
  title = 'Jonas and Olviers DR Quiz Tracker';

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
