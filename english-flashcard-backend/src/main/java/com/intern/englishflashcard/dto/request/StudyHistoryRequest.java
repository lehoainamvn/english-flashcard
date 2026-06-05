package com.intern.englishflashcard.dto.request;

public class StudyHistoryRequest {
    private Long categoryId;
    private Integer learnedWords;
    private Integer totalWords;

    public StudyHistoryRequest() {}

    public StudyHistoryRequest(Long categoryId, Integer learnedWords, Integer totalWords) {
        this.categoryId = categoryId;
        this.learnedWords = learnedWords;
        this.totalWords = totalWords;
    }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public Integer getLearnedWords() { return learnedWords; }
    public void setLearnedWords(Integer learnedWords) { this.learnedWords = learnedWords; }

    public Integer getTotalWords() { return totalWords; }
    public void setTotalWords(Integer totalWords) { this.totalWords = totalWords; }
}
