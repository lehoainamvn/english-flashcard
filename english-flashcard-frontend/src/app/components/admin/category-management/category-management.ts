import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Category {
  id?: number;
  name: string;
}

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-management.html',
  styleUrl: './category-management.css'
})
export class CategoryManagementComponent implements OnInit {
  categories = signal<Category[]>([]);
  loading = signal(false);
  showModal = signal(false);
  editingCategory = signal<Category | null>(null);
  
  newCategory: Category = { name: '' };
  
  private apiUrl = 'http://localhost:8080/categories';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading.set(true);
    this.http.get<Category[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.categories.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Lỗi khi tải danh mục:', error);
        this.loading.set(false);
      }
    });
  }

  openCreateModal() {
    this.editingCategory.set(null);
    this.newCategory = { name: '' };
    this.showModal.set(true);
  }

  openEditModal(category: Category) {
    this.editingCategory.set(category);
    this.newCategory = { ...category };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingCategory.set(null);
    this.newCategory = { name: '' };
  }

  saveCategory() {
    if (!this.newCategory.name.trim()) {
      alert('Vui lòng nhập tên danh mục');
      return;
    }

    const isEditing = this.editingCategory() !== null;
    
    if (isEditing) {
      // Update existing category
      const categoryId = this.editingCategory()!.id!;
      this.http.put<Category>(`${this.apiUrl}/${categoryId}`, this.newCategory).subscribe({
        next: () => {
          this.loadCategories();
          this.closeModal();
          alert('Cập nhật danh mục thành công!');
        },
        error: (error) => {
          console.error('Lỗi khi cập nhật:', error);
          alert('Lỗi khi cập nhật danh mục!');
        }
      });
    } else {
      // Create new category
      this.http.post<Category>(this.apiUrl, this.newCategory).subscribe({
        next: () => {
          this.loadCategories();
          this.closeModal();
          alert('Thêm danh mục thành công!');
        },
        error: (error) => {
          console.error('Lỗi khi thêm:', error);
          alert('Lỗi khi thêm danh mục!');
        }
      });
    }
  }

  deleteCategory(category: Category) {
    if (!confirm(`Bạn có chắc muốn xóa danh mục "${category.name}"?`)) {
      return;
    }

    this.http.delete(`${this.apiUrl}/${category.id}`).subscribe({
      next: () => {
        this.loadCategories();
        alert('Xóa danh mục thành công!');
      },
      error: (error) => {
        console.error('Lỗi khi xóa:', error);
        alert('Lỗi khi xóa danh mục!');
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin']);
  }

  trackByIndex(index: number, item: Category): number {
    return item.id || index;
  }
}