import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { NavbarComponent } from '../shared/navbar/navbar';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
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
  showPassword = false;
  rememberMe = false;

  registerUsername = '';
  registerEmail = '';
  registerPassword = '';

  emailError = signal('');
  passwordError = signal('');

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.isLoggedIn()) {
      this.router.navigate([this.auth.isAdmin() ? '/admin' : '/dashboard']);
    }
  }

  switchMode() {
    this.isLogin.update(v => !v);
    this.errorMsg.set('');
    this.successMsg.set('');
    this.emailError.set('');
    this.passwordError.set('');
  }

  validateEmail() {
    if (!this.loginEmail) {
      this.emailError.set('Email không được để trống');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.loginEmail)) {
      this.emailError.set('Email không hợp lệ');
    } else {
      this.emailError.set('');
    }
  }

  validatePassword() {
    if (!this.loginPassword) {
      this.passwordError.set('Mật khẩu không được để trống');
    } else if (this.loginPassword.length < 6) {
      this.passwordError.set('Mật khẩu phải có ít nhất 6 ký tự');
    } else {
      this.passwordError.set('');
    }
  }

  isFormValid(): boolean {
    return !!(this.loginEmail && this.loginPassword && !this.emailError() && !this.passwordError());
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
        this.router.navigate([this.auth.isAdmin() ? '/admin' : '/dashboard']);
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
