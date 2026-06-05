import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService, Category } from '../../services/api/api';
import { AuthService } from '../../services/auth/auth';
import { NavbarComponent } from '../shared/navbar/navbar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  categories = signal<Category[]>([]);
  studyHistory = signal<{[key: string]: any}>({});
  isLoading = signal(true);
  searchTerm = signal('');

  get filteredCategories(): Category[] {
    const term = this.searchTerm().toLowerCase();
    return this.categories().filter(c => c.name.toLowerCase().includes(term));
  }

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadStudyHistory();
  }

  loadCategories() {
    this.api.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  loadStudyHistory() {
    this.api.getStudyHistory().subscribe({
      next: (data) => {
        const historyMap: {[key: string]: any} = {};
        data.forEach((item: any) => {
          historyMap[item.categoryName] = item;
        });
        this.studyHistory.set(historyMap);
      },
      error: () => console.error('Error loading study history')
    });
  }

  onSearch(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  goStudy(id: number) {
    this.router.navigate(['/study', id]);
  }

  hasStudyHistory(categoryName: string): boolean {
    return !!this.studyHistory()[categoryName];
  }

  getStudyButton(categoryName: string): {text: string, type: string} {
    if (this.hasStudyHistory(categoryName)) {
      return { text: 'Tiếp tục học', type: 'continue' };
    }
    return { text: 'Học ngay', type: 'start' };
  }

  getCategoryIcon(index: number): string {
    const icons = ['📚', '🌟', '🎯', '🔥', '💡', '🚀', '🎓', '✨', '🌈', '⚡', '🎪', '🎨'];
    return icons[index % icons.length];
  }

  getCardBg(index: number): string {
    const bgs = [
      '#eff6ff', // blue light
      '#f0fdf4', // green light
      '#fdf4ff', // purple light
      '#fff7ed', // orange light
      '#fdf2f8', // pink light
      '#ecfeff', // cyan light
      '#fefce8', // yellow light
    ];
    return bgs[index % bgs.length];
  }

  getCardColor(index: number): string {
    const colors = ['#3b82f6', '#22c55e', '#a855f7', '#f97316', '#ec4899', '#06b6d4', '#eab308'];
    return colors[index % colors.length];
  }
}
