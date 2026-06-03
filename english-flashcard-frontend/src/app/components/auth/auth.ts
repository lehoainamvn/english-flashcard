import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class AuthComponent {
  isLogin = signal(true);
  isLoading = signal(false);
  errorMsg = signal('');
  successMsg = signal('');

  loginEmail = '';
  loginPassword = '';

  registerUsername = '';
  registerEmail = '';
  registerPassword = '';

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.isLoggedIn()) this.router.navigate(['/dashboard']);
  }

  switchMode() {
    this.isLogin.update(v => !v);
    this.errorMsg.set('');
    this.successMsg.set('');
  }

  onLogin() {
    if (!this.loginEmail || !this.loginPassword) {
      this.errorMsg.set('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    this.isLoading.set(true);
    this.errorMsg.set('');
    this.auth.login(this.loginEmail, this.loginPassword).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMsg.set(err.error?.message || 'Email hoặc mật khẩu không đúng!');
      }
    });
  }

  onRegister() {
    if (!this.registerUsername || !this.registerEmail || !this.registerPassword) {
      this.errorMsg.set('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    this.isLoading.set(true);
    this.errorMsg.set('');
    this.auth.register(this.registerUsername, this.registerEmail, this.registerPassword).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMsg.set('Đăng ký thành công! Hãy đăng nhập.');
        this.isLogin.set(true);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMsg.set(err.error?.message || 'Đăng ký thất bại, vui lòng thử lại!');
      }
    });
  }
}
