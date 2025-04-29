import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  environment = environment;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit(): Promise<void> {
    if (this.isLoading) return;
    
    this.isLoading = true;
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Login failed:', error);
      // You might want to show an error message to the user here
    } finally {
      this.isLoading = false;
    }
  }

  quickLogin(): void {
    this.email = 'test@example.com';
    this.password = 'test123';
    this.onSubmit();
  }
} 