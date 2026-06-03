import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService, Category } from '../../services/api/api';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  categories = signal<Category[]>([]);
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
    this.api.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onSearch(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  goStudy(id: number) {
    this.router.navigate(['/study', id]);
  }

  logout() {
    this.auth.logout();
  }

  getCategoryIcon(index: number): string {
    const icons = ['📚','🌟','🎯','🔥','💡','🚀','🎓','✨','🌈','⚡','🎪','🎨'];
    return icons[index % icons.length];
  }

  getCardColor(index: number): string {
    const colors = [
      '#3b82f6', // blue
      '#22c55e', // green
      '#a855f7', // purple
      '#f97316', // orange
      '#ec4899', // pink
      '#06b6d4', // cyan
      '#eab308'  // yellow
    ];
    return colors[index % colors.length];
  }
}
