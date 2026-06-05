import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Flashcard } from '../../services/api/api';
import { DictionaryService, DictResult } from '../../services/dictionary/dictionary';

@Component({
  selector: 'app-flashcard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flashcard.html',
  styleUrl: './flashcard.css'
})
export class FlashcardComponent implements OnInit {
  flashcards = signal<Flashcard[]>([]);
  currentIndex = signal(0);
  isFlipped = signal(false);
  isLoading = signal(true);
  categoryName = signal('');
  categoryId = signal<number>(0);

  // Learning tracking
  learnedCount = signal(0);

  // Dictionary API state
  dictData = signal<DictResult | null>(null);
  dictLoading = signal(false);
  dictError = signal(false);

  current = computed(() => this.flashcards()[this.currentIndex()] ?? null);
  progress = computed(() => {
    const total = this.flashcards().length;
    return total > 0 ? Math.round(((this.currentIndex() + 1) / total) * 100) : 0;
  });

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private dict: DictionaryService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('categoryId'));
    this.categoryId.set(id);
    this.api.getFlashcards(id).subscribe({
      next: (data) => {
        this.flashcards.set(data);
        if (data.length > 0) this.categoryName.set(data[0].category.name);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  flip() {
    const flipping = !this.isFlipped();
    this.isFlipped.set(flipping);

    // Gọi Dictionary API khi lật sang mặt sau
    if (flipping && this.current()) {
      const word = this.current()!.word;
      this.dictData.set(null);
      this.dictError.set(false);
      this.dictLoading.set(true);

      this.dict.lookup(word).subscribe({
        next: (result) => {
          this.dictData.set(result);
          this.dictLoading.set(false);
          if (!result) this.dictError.set(true);
        },
        error: () => {
          this.dictLoading.set(false);
          this.dictError.set(true);
        }
      });
    }
  }

  next() {
    if (this.currentIndex() < this.flashcards().length - 1) {
      this.isFlipped.set(false);
      this.dictData.set(null);
      this.dictError.set(false);
      setTimeout(() => this.currentIndex.update(v => v + 1), 150);
    }
  }

  markLearned() {
    this.learnedCount.update(v => v + 1);
    this.next();
  }

  prev() {
    if (this.currentIndex() > 0) {
      this.isFlipped.set(false);
      this.dictData.set(null);
      this.dictError.set(false);
      setTimeout(() => this.currentIndex.update(v => v - 1), 150);
    }
  }

  playAudio() {
    const url = this.dictData()?.audio;
    if (url) new Audio(url).play();
  }

  reload() {
    this.currentIndex.set(0);
    this.isFlipped.set(false);
    this.dictData.set(null);
    this.dictError.set(false);
    this.learnedCount.set(0);
  }

  goBack() {
    // Lưu lịch sử học tập
    if (this.flashcards().length > 0) {
      const request = {
        categoryId: this.categoryId(),
        learnedWords: this.learnedCount(),
        totalWords: this.flashcards().length
      };

      this.api.saveStudyHistory(request).subscribe({
        next: () => {
          console.log('Study history saved');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Error saving study history:', err);
          this.router.navigate(['/dashboard']);
        }
      });
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
