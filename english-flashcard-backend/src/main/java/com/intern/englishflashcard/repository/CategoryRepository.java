package com.intern.englishflashcard.repository;

import com.intern.englishflashcard.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
