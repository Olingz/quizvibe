import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="login-container">
      <div class="login-header">
        <h2>Welcome Back! 💖</h2>
        <p class="subtitle">Let's get you logged in</p>
      </div>
      <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" [(ngModel)]="email" required placeholder="Enter your email">
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" [(ngModel)]="password" required placeholder="Enter your password">
        </div>
        
        <button type="submit" [disabled]="!loginForm.form.valid || isLoading" class="login-button">
          {{ isLoading ? 'Logging in... ✨' : 'Login 💕' }}
        </button>
        
        <div *ngIf="!environment.production" class="quick-login-container">
          <button type="button" (click)="quickLogin()" class="quick-login-button">
            Quick Login (Dev Mode)
          </button>
        </div>
        
        <div *ngIf="error" class="error-message">
          {{ error }}
        </div>
      </form>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 30px;
      border-radius: 20px;
      background: linear-gradient(135deg, #fff5f5, #fff0f5);
      box-shadow: 0 8px 32px rgba(255, 182, 193, 0.2);
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    h2 {
      color: #ff69b4;
      font-size: 28px;
      margin-bottom: 8px;
      font-weight: 600;
    }
    
    .subtitle {
      color: #ff69b4;
      opacity: 0.8;
      font-size: 16px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      color: #ff69b4;
      font-weight: 500;
    }
    
    input {
      width: 100%;
      padding: 12px;
      border: 2px solid #ffb6c1;
      border-radius: 12px;
      background: white;
      transition: all 0.3s ease;
      font-size: 16px;
    }
    
    input:focus {
      outline: none;
      border-color: #ff69b4;
      box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
    }
    
    .login-button {
      width: 100%;
      background: linear-gradient(135deg, #ff69b4, #ffb6c1);
      color: white;
      padding: 14px;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      transition: all 0.3s ease;
      margin-top: 10px;
    }
    
    .login-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);
    }
    
    .login-button:disabled {
      background: #ffd1dc;
      cursor: not-allowed;
    }
    
    .quick-login-container {
      margin-top: 15px;
      text-align: center;
    }
    
    .quick-login-button {
      background: #4CAF50;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
    }
    
    .quick-login-button:hover {
      background: #45a049;
      transform: translateY(-2px);
    }
    
    .error-message {
      color: #ff69b4;
      margin-top: 15px;
      text-align: center;
      padding: 10px;
      background: rgba(255, 105, 180, 0.1);
      border-radius: 8px;
    }
  `]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  error: string = '';
  environment = environment;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit(): Promise<void> {
    this.isLoading = true;
    this.error = '';
    
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/']);
    } catch (error) {
      this.error = 'Invalid email or password. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  async quickLogin(): Promise<void> {
    this.email = 'test@example.com';
    this.password = 'test123';
    await this.onSubmit();
  }
} 