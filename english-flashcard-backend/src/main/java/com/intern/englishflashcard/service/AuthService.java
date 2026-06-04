package com.intern.englishflashcard.service;

import com.intern.englishflashcard.dto.request.LoginRequest;
import com.intern.englishflashcard.dto.request.RegisterRequest;
import com.intern.englishflashcard.dto.response.LoginResponse;
import com.intern.englishflashcard.entity.User;
import com.intern.englishflashcard.repository.UserRepository;
import com.intern.englishflashcard.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            throw new RuntimeException("Email không tồn tại");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Sai mật khẩu");
        }

        UserDetails userDetails = buildUserDetails(user);
        String token = jwtUtil.generateToken(userDetails);

        return new LoginResponse(token, user.getId(), user.getUsername(), user.getEmail(), user.getRole());
    }

    public LoginResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được sử dụng");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setCreatedAt(LocalDateTime.now());

        user = userRepository.save(user);

        UserDetails userDetails = buildUserDetails(user);
        String token = jwtUtil.generateToken(userDetails);

        return new LoginResponse(token, user.getId(), user.getUsername(), user.getEmail(), user.getRole());
    }

    private UserDetails buildUserDetails(User user) {
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );
    }
}
