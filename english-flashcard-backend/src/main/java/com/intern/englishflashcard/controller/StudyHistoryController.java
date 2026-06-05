package com.intern.englishflashcard.controller;

import com.intern.englishflashcard.dto.request.StudyHistoryRequest;
import com.intern.englishflashcard.dto.response.StudyHistoryResponse;
import com.intern.englishflashcard.entity.User;
import com.intern.englishflashcard.repository.UserRepository;
import com.intern.englishflashcard.service.StudyHistoryService;
import com.intern.englishflashcard.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/study-history")
@CrossOrigin(origins = "http://localhost:4200")
public class StudyHistoryController {

    @Autowired
    private StudyHistoryService studyHistoryService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> saveStudyHistory(
            @RequestHeader("Authorization") String token,
            @RequestBody StudyHistoryRequest request) {
        try {
            System.out.println("=== SAVE STUDY HISTORY ===");
            System.out.println("Token header: " + (token != null ? token.substring(0, Math.min(30, token.length())) + "..." : "null"));
            
            String email = jwtUtil.extractUsername(token.substring(7));
            System.out.println("Email extracted: " + email);
            
            Optional<User> user = userRepository.findByEmail(email);
            System.out.println("User found: " + (user.isPresent() ? user.get().getUsername() : "NO"));
            
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            StudyHistoryResponse response = studyHistoryService.saveStudyHistory(user.get(), request);
            System.out.println("✓ Saved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("✗ Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error saving study history: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserStudyHistory(
            @RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractUsername(token.substring(7));
            Optional<User> user = userRepository.findByEmail(email);
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            List<StudyHistoryResponse> histories = studyHistoryService.getUserStudyHistory(user.get());
            return ResponseEntity.ok(histories);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching study history: " + e.getMessage());
        }
    }

    @GetMapping("/recent")
    public ResponseEntity<?> getRecentStudyHistory(
            @RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractUsername(token.substring(7));
            Optional<User> user = userRepository.findByEmail(email);
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            List<StudyHistoryResponse> histories = studyHistoryService.getUserStudyHistoryRecent(user.get());
            return ResponseEntity.ok(histories);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching recent study history: " + e.getMessage());
        }
    }
}
