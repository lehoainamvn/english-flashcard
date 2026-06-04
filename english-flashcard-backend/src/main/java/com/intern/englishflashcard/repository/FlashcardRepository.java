package com.intern.englishflashcard.repository;

import com.intern.englishflashcard.entity.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {
    List<Flashcard> findByCategoryId(Long categoryId);
    void deleteByCategoryId(Long categoryId);
}
