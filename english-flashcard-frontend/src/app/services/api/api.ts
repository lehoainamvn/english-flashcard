import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  name: string;
}

export interface Flashcard {
  id: number;
  word: string;
  meaning: string | null;
  example: string | null;
  category: Category;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string | null;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly API = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API}/categories`);
  }

  getFlashcards(categoryId: number): Observable<Flashcard[]> {
    return this.http.get<Flashcard[]>(`${this.API}/categories/${categoryId}/flashcards`);
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.API}/api/user/me`);
  }

  updateProfile(data: { username?: string; currentPassword?: string; newPassword?: string }): Observable<any> {
    return this.http.put(`${this.API}/api/user/me`, data);
  }

  saveStudyHistory(request: { categoryId: number; learnedWords: number; totalWords: number }): Observable<any> {
    return this.http.post(`${this.API}/api/study-history`, request);
  }

  getStudyHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/api/study-history`);
  }

  getRecentStudyHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/api/study-history/recent`);
  }
}
