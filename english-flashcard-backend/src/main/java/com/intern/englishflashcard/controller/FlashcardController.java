package com.intern.englishflashcard.controller;

import com.intern.englishflashcard.entity.Flashcard;
import com.intern.englishflashcard.repository.FlashcardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories/{categoryId}/flashcards")
@CrossOrigin(origins = "*")
public class FlashcardController {

    @Autowired
    private FlashcardRepository flashcardRepository;

    @GetMapping
    public ResponseEntity<List<Flashcard>> getFlashcardsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(flashcardRepository.findByCategoryId(categoryId));
    }
}
