package com.intern.englishflashcard.controller;

import com.intern.englishflashcard.entity.Category;
import com.intern.englishflashcard.entity.Flashcard;
import com.intern.englishflashcard.repository.CategoryRepository;
import com.intern.englishflashcard.repository.FlashcardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/import")
@CrossOrigin(origins = "*")
public class DataImportController {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private FlashcardRepository flashcardRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<?> importData() {
        try {
            // Xóa dữ liệu cũ nếu có để import lại từ đầu
            flashcardRepository.deleteAll();
            categoryRepository.deleteAll();

            List<String> words = Files.readAllLines(Paths.get("d:/GitHub/english-flashcard/words.txt"));
            
            if (words.isEmpty()) {
                return ResponseEntity.badRequest().body("File words.txt trống");
            }
            
            int wordsPerCategory = 50;
            int totalCategories = (int) Math.ceil((double) words.size() / wordsPerCategory);
            
            for (int i = 0; i < totalCategories; i++) {
                Category category = new Category();
                category.setName("Bài " + (i + 1));
                category = categoryRepository.save(category);
                
                int start = i * wordsPerCategory;
                int end = Math.min(start + wordsPerCategory, words.size());
                
                List<Flashcard> flashcards = new ArrayList<>();
                for (int j = start; j < end; j++) {
                    String word = words.get(j).trim();
                    if (word.isEmpty()) continue;
                    
                    Flashcard flashcard = new Flashcard();
                    flashcard.setWord(word);
                    // Meaning and example are null by default
                    flashcard.setCategory(category);
                    flashcards.add(flashcard);
                }
                
                flashcardRepository.saveAll(flashcards);
            }
            
            return ResponseEntity.ok(java.util.Map.of("message", "Import thành công " + words.size() + " từ vựng vào " + totalCategories + " chủ đề."));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(java.util.Map.of("error", "Lỗi đọc file: " + e.getMessage()));
        }
    }
}
