import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin/admin';
import { ApiService, Category } from '../../../services/api/api';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.css'
})
export class AdminCategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  message = '';
  messageType: 'success' | 'error' = 'success';

  showForm = false;
  editingId: number | null = null;
  formName = '';
  deleteTarget: Category | null = null;

  constructor(private adminService: AdminService, private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.apiService.getCategories().subscribe({
      next: (data) => { this.categories = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openCreate(): void {
    this.editingId = null;
    this.formName = '';
    this.showForm = true;
  }

  openEdit(cat: Category): void {
    this.editingId = cat.id;
    this.formName = cat.name;
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.formName = '';
    this.editingId = null;
  }

  saveCategory(): void {
    if (!this.formName.trim()) return;
    if (this.editingId) {
      this.adminService.updateCategory(this.editingId, this.formName).subscribe({
        next: () => { this.showMessage('Cập nhật danh mục thành công', 'success'); this.cancelForm(); this.loadCategories(); },
        error: () => this.showMessage('Lỗi khi cập nhật', 'error')
      });
    } else {
      this.adminService.createCategory(this.formName).subscribe({
        next: () => { this.showMessage('Tạo danh mục thành công', 'success'); this.cancelForm(); this.loadCategories(); },
        error: () => this.showMessage('Lỗi khi tạo danh mục', 'error')
      });
    }
  }

  confirmDelete(cat: Category): void {
    this.deleteTarget = cat;
  }

  deleteCategory(): void {
    if (!this.deleteTarget) return;
    const target = this.deleteTarget;
    this.deleteTarget = null;
    this.adminService.deleteCategory(target.id).subscribe({
      next: () => { this.categories = this.categories.filter(c => c.id !== target.id); this.showMessage('Đã xóa danh mục', 'success'); },
      error: () => this.showMessage('Lỗi khi xóa danh mục', 'error')
    });
  }

  showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => (this.message = ''), 3000);
  }
}
