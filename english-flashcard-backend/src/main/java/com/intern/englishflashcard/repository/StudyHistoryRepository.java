package com.intern.englishflashcard.repository;

import com.intern.englishflashcard.entity.StudyHistory;
import com.intern.englishflashcard.entity.User;
import com.intern.englishflashcard.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface StudyHistoryRepository extends JpaRepository<StudyHistory, Long> {
    List<StudyHistory> findByUserOrderByLastStudiedAtDesc(User user);
    
    List<StudyHistory> findByUserOrderByLastStudiedAtDesc(User user, Pageable pageable);
    
    List<StudyHistory> findByUserAndCategory(User user, Category category);
}
