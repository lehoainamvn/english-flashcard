package com.intern.englishflashcard.dto.response;

import java.time.LocalDateTime;

public class StudyHistoryResponse {
    private Long id;
    private String categoryName;
    private Integer learnedWords;
    private Integer totalWords;
    private Double accuracy;
    private LocalDateTime studiedAt;

    public StudyHistoryResponse(Long id, String categoryName, Integer learnedWords, Integer totalWords, Double accuracy, LocalDateTime studiedAt) {
        this.id = id;
        this.categoryName = categoryName;
        this.learnedWords = learnedWords;
        this.totalWords = totalWords;
        this.accuracy = accuracy;
        this.studiedAt = studiedAt;
    }

    public Long getId() { return id; }
    public String getCategoryName() { return categoryName; }
    public Integer getLearnedWords() { return learnedWords; }
    public Integer getTotalWords() { return totalWords; }
    public Double getAccuracy() { return accuracy; }
    public LocalDateTime getStudiedAt() { return studiedAt; }
}
