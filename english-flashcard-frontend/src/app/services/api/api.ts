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
}
