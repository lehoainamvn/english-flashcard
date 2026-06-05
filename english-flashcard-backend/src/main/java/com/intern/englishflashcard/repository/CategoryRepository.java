package com.intern.englishflashcard.repository;

import com.intern.englishflashcard.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    Optional<Category> findByName(String name);
    
    @Query("SELECT COUNT(c) FROM Category c")
    long countCategories();
    
    boolean existsByName(String name);
}
