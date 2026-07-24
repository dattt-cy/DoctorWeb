package com.doctorweb.backend.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class AppConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(
            @Value("${app.admin.username}") String username,
            @Value("${app.admin.password}") String password,
            PasswordEncoder passwordEncoder) {
        var encodedPassword = passwordEncoder.encode(password);
        return requestedUsername -> {
            if (!username.equals(requestedUsername)) {
                throw new org.springframework.security.core.userdetails.UsernameNotFoundException("User not found");
            }
            return User.withUsername(username)
                    .password(encodedPassword)
                    .roles("ADMIN")
                    .build();
        };
    }
}
