import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalCategories: number;
  totalFlashcards: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly API = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.API}/stats`);
  }

  // Users
  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.API}/users`);
  }

  updateUserRole(id: number, role: string): Observable<any> {
    return this.http.put(`${this.API}/users/${id}/role`, { role });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.API}/users/${id}`);
  }

  // Categories
  createCategory(name: string): Observable<any> {
    return this.http.post(`${this.API}/categories`, { name });
  }

  updateCategory(id: number, name: string): Observable<any> {
    return this.http.put(`${this.API}/categories/${id}`, { name });
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.API}/categories/${id}`);
  }

  // Flashcards
  createFlashcard(data: { word: string; meaning: string; example: string; category: { id: number } }): Observable<any> {
    return this.http.post(`${this.API}/flashcards`, data);
  }

  updateFlashcard(id: number, data: any): Observable<any> {
    return this.http.put(`${this.API}/flashcards/${id}`, data);
  }

  deleteFlashcard(id: number): Observable<any> {
    return this.http.delete(`${this.API}/flashcards/${id}`);
  }
}
