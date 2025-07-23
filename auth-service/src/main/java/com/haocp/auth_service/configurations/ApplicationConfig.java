package com.haocp.auth_service.configurations;

import com.haocp.auth_service.entities.Role;
import com.haocp.auth_service.entities.User;
import com.haocp.auth_service.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Date;

@Configuration
public class ApplicationConfig {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(UserRepository authRepo) {
        return args -> {
            if (authRepo.findByUsername("admin").isEmpty()){
                User user = User.builder()
                        .email("admin@admin.com")
                        .username("admin")
                        .password(passwordEncoder.encode("admin"))
                        .role(Role.ADMIN)
                        .createdAt(new Date())
                        .updatedAt(new Date())
                        .build();
                authRepo.save(user);
            }
        };
    }

}
