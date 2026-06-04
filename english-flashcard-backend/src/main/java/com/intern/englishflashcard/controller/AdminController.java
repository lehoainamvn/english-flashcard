package com.intern.englishflashcard.controller;

import com.intern.englishflashcard.entity.Category;
import com.intern.englishflashcard.entity.Flashcard;
import com.intern.englishflashcard.entity.User;
import com.intern.englishflashcard.repository.CategoryRepository;
import com.intern.englishflashcard.repository.FlashcardRepository;
import com.intern.englishflashcard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private FlashcardRepository flashcardRepository;

    // ===== STATS =====

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(Map.of(
            "totalUsers", userRepository.count(),
            "totalCategories", categoryRepository.count(),
            "totalFlashcards", flashcardRepository.count()
        ));
    }

    // ===== USER MANAGEMENT =====

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String role = body.get("role");
        if (!"USER".equals(role) && !"ADMIN".equals(role)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Role không hợp lệ. Chỉ chấp nhận USER hoặc ADMIN"));
        }
        User user = userOpt.get();
        user.setRole(role);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Cập nhật role thành công"));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Xóa người dùng thành công"));
    }

    // ===== CATEGORY MANAGEMENT =====

    @PostMapping("/categories")
    public ResponseEntity<?> createCategory(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        if (name == null || name.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Tên danh mục không được rỗng"));
        }
        Category category = new Category();
        category.setName(name);
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<Category> catOpt = categoryRepository.findById(id);
        if (catOpt.isEmpty()) return ResponseEntity.notFound().build();
        catOpt.get().setName(body.get("name"));
        return ResponseEntity.ok(categoryRepository.save(catOpt.get()));
    }

    @DeleteMapping("/categories/{id}")
    @Transactional
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        if (!categoryRepository.existsById(id)) return ResponseEntity.notFound().build();
        flashcardRepository.deleteByCategoryId(id);
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Xóa danh mục thành công"));
    }

    // ===== FLASHCARD MANAGEMENT =====

    @PostMapping("/flashcards")
    public ResponseEntity<?> createFlashcard(@RequestBody Flashcard flashcard) {
        return ResponseEntity.ok(flashcardRepository.save(flashcard));
    }

    @PutMapping("/flashcards/{id}")
    public ResponseEntity<?> updateFlashcard(@PathVariable Long id, @RequestBody Flashcard updated) {
        Optional<Flashcard> cardOpt = flashcardRepository.findById(id);
        if (cardOpt.isEmpty()) return ResponseEntity.notFound().build();
        Flashcard card = cardOpt.get();
        card.setWord(updated.getWord());
        card.setMeaning(updated.getMeaning());
        card.setExample(updated.getExample());
        if (updated.getCategory() != null) card.setCategory(updated.getCategory());
        return ResponseEntity.ok(flashcardRepository.save(card));
    }

    @DeleteMapping("/flashcards/{id}")
    public ResponseEntity<?> deleteFlashcard(@PathVariable Long id) {
        if (!flashcardRepository.existsById(id)) return ResponseEntity.notFound().build();
        flashcardRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Xóa flashcard thành công"));
    }
}
