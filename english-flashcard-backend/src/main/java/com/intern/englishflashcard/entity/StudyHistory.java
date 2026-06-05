package com.intern.englishflashcard.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "study_history")
public class StudyHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private Integer learnedWords;

    @Column(nullable = false)
    private Integer totalWords;

    @Column(nullable = false)
    private LocalDateTime studiedAt;

    @Column(nullable = false)
    private LocalDateTime lastStudiedAt;

    public StudyHistory() {}

    public StudyHistory(User user, Category category, Integer learnedWords, Integer totalWords) {
        this.user = user;
        this.category = category;
        this.learnedWords = learnedWords;
        this.totalWords = totalWords;
        this.studiedAt = LocalDateTime.now();
        this.lastStudiedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public Integer getLearnedWords() { return learnedWords; }
    public void setLearnedWords(Integer learnedWords) { this.learnedWords = learnedWords; }

    public Integer getTotalWords() { return totalWords; }
    public void setTotalWords(Integer totalWords) { this.totalWords = totalWords; }

    public LocalDateTime getStudiedAt() { return studiedAt; }
    public void setStudiedAt(LocalDateTime studiedAt) { this.studiedAt = studiedAt; }

    public LocalDateTime getLastStudiedAt() { return lastStudiedAt; }
    public void setLastStudiedAt(LocalDateTime lastStudiedAt) { this.lastStudiedAt = lastStudiedAt; }

    public Double getAccuracy() {
        if (totalWords == 0) return 0.0;
        return (learnedWords.doubleValue() / totalWords) * 100;
    }
}
