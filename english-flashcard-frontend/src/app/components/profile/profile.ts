import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, UserProfile } from '../../services/api/api';
import { AuthService } from '../../services/auth/auth';
import { NavbarComponent } from '../shared/navbar/navbar';

interface StudyHistoryItem {
  id: number;
  categoryName: string;
  learnedWords: number;
  totalWords: number;
  accuracy: number;
  studiedAt: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  profile = signal<UserProfile | null>(null);
  studyHistory = signal<StudyHistoryItem[]>([]);
  isLoading = signal(true);
  isEditing = signal(false);
  isSaving = signal(false);

  editUsername = '';
  showPasswordForm = signal(false);
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  successMsg = signal('');
  errorMsg = signal('');

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.loadProfile();
    this.loadStudyHistory();
  }

  loadProfile() {
    this.isLoading.set(true);
    this.api.getProfile().subscribe({
      next: (data) => {
        this.profile.set(data);
        this.editUsername = data.username;
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMsg.set('Không thể tải thông tin hồ sơ');
      }
    });
  }

  loadStudyHistory() {
    this.api.getRecentStudyHistory().subscribe({
      next: (data) => {
        this.studyHistory.set(data as StudyHistoryItem[]);
      },
      error: () => {
        console.error('Could not load study history');
      }
    });
  }

  startEdit() {
    this.isEditing.set(true);
    this.editUsername = this.profile()?.username ?? '';
    this.clearMessages();
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.editUsername = this.profile()?.username ?? '';
    this.showPasswordForm.set(false);
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.clearMessages();
  }

  saveProfile() {
    this.clearMessages();
    if (!this.editUsername.trim()) {
      this.errorMsg.set('Tên người dùng không được để trống');
      return;
    }
    const data: any = {};
    let hasChanges = false;
    if (this.editUsername.trim() !== this.profile()?.username) {
      data.username = this.editUsername.trim();
      hasChanges = true;
    }
    if (this.showPasswordForm()) {
      if (!this.currentPassword || !this.newPassword || this.newPassword.length < 6 || this.newPassword !== this.confirmPassword) {
        this.errorMsg.set('Vui lòng kiểm tra lại mật khẩu');
        return;
      }
      data.currentPassword = this.currentPassword;
      data.newPassword = this.newPassword;
      hasChanges = true;
    }
    if (!hasChanges) { this.isEditing.set(false); return; }
    this.isSaving.set(true);
    this.api.updateProfile(data).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.isEditing.set(false);
        this.showPasswordForm.set(false);
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.successMsg.set('Cập nhật hồ sơ thành công!');
        if (data.username) localStorage.setItem('auth_username', data.username);
        this.loadProfile();
        setTimeout(() => this.successMsg.set(''), 3000);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMsg.set(err.error?.message ?? 'Cập nhật thất bại');
      }
    });
  }

  togglePasswordForm() {
    this.showPasswordForm.update(v => !v);
    if (!this.showPasswordForm()) {
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    }
  }

  clearMessages() {
    this.successMsg.set('');
    this.errorMsg.set('');
  }

  getRoleName(role: string): string {
    return role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng';
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return '—';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch { return dateStr; }
  }

  formatStudyDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === today.toDateString()) {
        return 'Hôm nay ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Hôm qua ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      } else {
        return date.toLocaleDateString('vi-VN');
      }
    } catch { return dateStr; }
  }

  getAccuracyLevel(accuracy: number): string {
    if (accuracy >= 80) return 'high';
    if (accuracy >= 60) return 'medium';
    return 'low';
  }

  goBack() { this.router.navigate(['/dashboard']); }
  logout() { this.auth.logout(); }
}
