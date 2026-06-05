package com.intern.englishflashcard.service;

import com.intern.englishflashcard.dto.request.StudyHistoryRequest;
import com.intern.englishflashcard.dto.response.StudyHistoryResponse;
import com.intern.englishflashcard.entity.Category;
import com.intern.englishflashcard.entity.StudyHistory;
import com.intern.englishflashcard.entity.User;
import com.intern.englishflashcard.repository.CategoryRepository;
import com.intern.englishflashcard.repository.StudyHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class StudyHistoryService {
    @Autowired
    private StudyHistoryRepository studyHistoryRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public StudyHistoryResponse saveStudyHistory(User user, StudyHistoryRequest request) {
        Optional<Category> category = categoryRepository.findById(request.getCategoryId());
        if (category.isEmpty()) {
            throw new RuntimeException("Category not found");
        }

        // Check xem user đã học category này chưa
        List<StudyHistory> existingHistories = studyHistoryRepository.findByUserAndCategory(user, category.get());
        
        StudyHistory history;
        if (!existingHistories.isEmpty()) {
            // Nếu đã học, update lần học gần nhất
            history = existingHistories.get(0);
            history.setLearnedWords(request.getLearnedWords());
            history.setTotalWords(request.getTotalWords());
            history.setLastStudiedAt(LocalDateTime.now());
        } else {
            // Nếu chưa học, tạo record mới
            history = new StudyHistory(
                user,
                category.get(),
                request.getLearnedWords(),
                request.getTotalWords()
            );
        }

        StudyHistory saved = studyHistoryRepository.save(history);
        return mapToResponse(saved);
    }

    public List<StudyHistoryResponse> getUserStudyHistory(User user) {
        List<StudyHistory> histories = studyHistoryRepository.findByUserOrderByLastStudiedAtDesc(user);
        return histories.stream().map(this::mapToResponse).toList();
    }

    public List<StudyHistoryResponse> getUserStudyHistoryRecent(User user) {
        Pageable pageable = PageRequest.of(0, 10);
        List<StudyHistory> histories = studyHistoryRepository.findByUserOrderByLastStudiedAtDesc(user, pageable);
        return histories.stream().map(this::mapToResponse).toList();
    }

    private StudyHistoryResponse mapToResponse(StudyHistory history) {
        return new StudyHistoryResponse(
            history.getId(),
            history.getCategory().getName(),
            history.getLearnedWords(),
            history.getTotalWords(),
            history.getAccuracy(),
            history.getLastStudiedAt()
        );
    }
}
