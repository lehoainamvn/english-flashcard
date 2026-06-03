import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map, switchMap } from 'rxjs';

export interface DictDefinition {
  definition: string;       // Tiếng Anh (gốc)
  definitionVi: string;     // Tiếng Việt (dịch)
  example?: string;
  exampleVi?: string;
}

export interface DictMeaning {
  partOfSpeech: string;
  partOfSpeechVi: string;
  definitions: DictDefinition[];
  synonyms: string[];
}

export interface DictResult {
  word: string;
  phonetic?: string;
  audio?: string;
  meanings: DictMeaning[];
}

const POS_MAP: Record<string, string> = {
  noun: 'Danh từ',
  verb: 'Động từ',
  adjective: 'Tính từ',
  adverb: 'Trạng từ',
  pronoun: 'Đại từ',
  preposition: 'Giới từ',
  conjunction: 'Liên từ',
  interjection: 'Thán từ',
  article: 'Mạo từ',
  determiner: 'Từ hạn định',
  exclamation: 'Thán từ',
};

@Injectable({ providedIn: 'root' })
export class DictionaryService {
  private readonly DICT_API = 'https://api.dictionaryapi.dev/api/v2/entries/en';
  // Proxy backend của chúng ta
  private readonly TRANS_API = 'http://localhost:8080/api/translate';
  private cache = new Map<string, DictResult | null>();

  constructor(private http: HttpClient) {}

  /** Dịch văn bản sang tiếng Việt qua backend proxy */
  private translate(text: string): Observable<string> {
    if (!text?.trim()) return of('');
    
    // Gọi qua backend của chúng ta thay vì Google trực tiếp
    const url = `${this.TRANS_API}?text=${encodeURIComponent(text)}`;
    
    return this.http.get<any>(url).pipe(
      map(res => res?.translatedText ?? text),
      catchError(() => of(text))
    );
  }

  /** Dịch nhiều chuỗi bằng cách gộp với ký tự phân cách đặc biệt */
  private translateBatch(texts: string[]): Observable<string[]> {
    const nonEmpty = texts.map(t => t?.trim() || '');
    if (nonEmpty.every(t => !t)) return of(texts);

    // Dùng \n làm separator — Google dịch tốt với multiline
    const joined = nonEmpty.join('\n');
    return this.translate(joined).pipe(
      map(result => {
        const lines = result.split('\n');
        return nonEmpty.map((orig, i) => {
          const translated = lines[i]?.trim();
          // Nếu translated rỗng hoặc trùng với gốc (chưa dịch được) thì giữ gốc
          return translated && translated !== orig ? translated : orig;
        });
      })
    );
  }

  lookup(word: string): Observable<DictResult | null> {
    const key = word.toLowerCase().trim();

    return this.http.get<any[]>(`${this.DICT_API}/${encodeURIComponent(key)}`).pipe(
      switchMap(data => {
        const entry = data[0];

        // Tìm audio
        let audio: string | undefined;
        for (const ph of entry.phonetics ?? []) {
          if (ph.audio) { audio = ph.audio; break; }
        }

        const rawMeanings = (entry.meanings ?? []).slice(0, 3);

        // Thu thập tất cả text cần dịch (definition + example)
        const textsToTranslate: string[] = [];
        rawMeanings.forEach((m: any) => {
          (m.definitions ?? []).slice(0, 2).forEach((d: any) => {
            textsToTranslate.push(d.definition ?? '');
            textsToTranslate.push(d.example ?? '');
          });
        });

        return this.translateBatch(textsToTranslate).pipe(
          map(translated => {
            console.log('Original batch:', textsToTranslate);
            console.log('Translated batch:', translated);
            let idx = 0;
            const meanings: DictMeaning[] = rawMeanings.map((m: any) => ({
              partOfSpeech: m.partOfSpeech,
              partOfSpeechVi: POS_MAP[m.partOfSpeech] ?? m.partOfSpeech,
              definitions: (m.definitions ?? []).slice(0, 2).map((d: any) => {
                const defVi = translated[idx++] ?? d.definition;
                const exVi  = translated[idx++] ?? '';
                return {
                  definition: d.definition,
                  definitionVi: defVi,
                  example: d.example,
                  exampleVi: d.example ? exVi : undefined
                } as DictDefinition;
              }),
              synonyms: (m.synonyms ?? []).slice(0, 4)
            }));

            return {
              word: entry.word,
              phonetic: entry.phonetic ?? entry.phonetics?.[0]?.text,
              audio,
              meanings
            };
          })
        );
      }),
      catchError((e) => {
        console.error('Dictionary API Error:', e);
        return of(null);
      })
    );
  }
}
