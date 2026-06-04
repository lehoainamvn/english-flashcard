import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, AdminUser } from '../../../services/admin/admin';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css'
})
export class AdminUsersComponent implements OnInit {
  users: AdminUser[] = [];
  loading = true;
  message = '';
  messageType: 'success' | 'error' = 'success';
  searchText = '';
  deleteTarget: AdminUser | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  get filteredUsers(): AdminUser[] {
    const q = this.searchText.toLowerCase();
    return this.users.filter(u =>
      u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getUsers().subscribe({
      next: (data) => { this.users = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  toggleRole(user: AdminUser): void {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    this.adminService.updateUserRole(user.id, newRole).subscribe({
      next: () => {
        user.role = newRole;
        this.showMessage(`Đã đổi role của ${user.username} thành ${newRole}`, 'success');
      },
      error: () => this.showMessage('Lỗi khi cập nhật role', 'error')
    });
  }

  confirmDelete(user: AdminUser): void {
    this.deleteTarget = user;
  }

  deleteUser(): void {
    if (!this.deleteTarget) return;
    const target = this.deleteTarget;
    this.deleteTarget = null;
    this.adminService.deleteUser(target.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== target.id);
        this.showMessage(`Đã xóa người dùng ${target.username}`, 'success');
      },
      error: () => this.showMessage('Lỗi khi xóa người dùng', 'error')
    });
  }

  showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => (this.message = ''), 3000);
  }
}
