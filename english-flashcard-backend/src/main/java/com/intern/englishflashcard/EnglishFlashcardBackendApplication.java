package com.intern.englishflashcard;

import com.intern.englishflashcard.entity.User;
import com.intern.englishflashcard.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class EnglishFlashcardBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(EnglishFlashcardBackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner initAdminUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
				User admin = new User();
				admin.setUsername("admin");
				admin.setEmail("admin@gmail.com");
				admin.setPassword(passwordEncoder.encode("123456"));
				admin.setRole("ADMIN");
				userRepository.save(admin);
				System.out.println(">>> Tạo tài khoản admin thành công: admin@gmail.com / 123456");
			} else {
				System.out.println(">>> Tài khoản admin đã tồn tại.");
			}
		};
	}

}
