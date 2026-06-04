import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin/admin';
import { ApiService, Category, Flashcard } from '../../../services/api/api';

@Component({
  selector: 'app-admin-words',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-words.html',
  styleUrl: './admin-words.css'
})
export class AdminWordsComponent implements OnInit {
  categories: Category[] = [];
  flashcards: Flashcard[] = [];
  selectedCategory: Category | null = null;
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  searchText = '';

  showForm = false;
  editingId: number | null = null;
  formWord = '';
  formMeaning = '';
  formExample = '';
  deleteTarget: Flashcard | null = null;

  constructor(private adminService: AdminService, private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getCategories().subscribe(data => (this.categories = data));
  }

  get filteredFlashcards(): Flashcard[] {
    const q = this.searchText.toLowerCase();
    return this.flashcards.filter(f =>
      f.word.toLowerCase().includes(q) ||
      (f.meaning ?? '').toLowerCase().includes(q)
    );
  }

  selectCategory(cat: Category): void {
    this.selectedCategory = cat;
    this.showForm = false;
    this.searchText = '';
    this.loading = true;
    this.apiService.getFlashcards(cat.id).subscribe({
      next: (data) => { this.flashcards = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openCreate(): void {
    this.editingId = null;
    this.formWord = '';
    this.formMeaning = '';
    this.formExample = '';
    this.showForm = true;
  }

  openEdit(card: Flashcard): void {
    this.editingId = card.id;
    this.formWord = card.word;
    this.formMeaning = card.meaning ?? '';
    this.formExample = card.example ?? '';
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
  }

  saveFlashcard(): void {
    if (!this.formWord.trim() || !this.selectedCategory) return;
    const payload = {
      word: this.formWord,
      meaning: this.formMeaning,
      example: this.formExample,
      category: { id: this.selectedCategory.id }
    };
    if (this.editingId) {
      this.adminService.updateFlashcard(this.editingId, payload).subscribe({
        next: () => { this.showMessage('Cập nhật từ vựng thành công', 'success'); this.cancelForm(); this.selectCategory(this.selectedCategory!); },
        error: () => this.showMessage('Lỗi khi cập nhật', 'error')
      });
    } else {
      this.adminService.createFlashcard(payload).subscribe({
        next: () => { this.showMessage('Thêm từ vựng thành công', 'success'); this.cancelForm(); this.selectCategory(this.selectedCategory!); },
        error: () => this.showMessage('Lỗi khi thêm từ', 'error')
      });
    }
  }

  confirmDelete(card: Flashcard): void {
    this.deleteTarget = card;
  }

  deleteFlashcard(): void {
    if (!this.deleteTarget) return;
    const target = this.deleteTarget;
    this.deleteTarget = null;
    this.adminService.deleteFlashcard(target.id).subscribe({
      next: () => { this.flashcards = this.flashcards.filter(f => f.id !== target.id); this.showMessage('Đã xóa từ vựng', 'success'); },
      error: () => this.showMessage('Lỗi khi xóa', 'error')
    });
  }

  showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => (this.message = ''), 3000);
  }
}
