package com.ecommerce.ordermanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Import added
import org.springframework.security.crypto.password.PasswordEncoder; // Import added
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
// Removed unused StaticHeadersWriter import
import org.springframework.http.HttpMethod;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .authorizeHttpRequests((requests) -> requests
                                                .requestMatchers(HttpMethod.GET, "/api/orders/**")
                                                .hasAnyRole("VIEWER", "ADMIN")
                                                .requestMatchers(HttpMethod.PATCH, "/api/orders/*/comment")
                                                .hasAnyRole("VIEWER", "ADMIN")
                                                .requestMatchers(HttpMethod.POST, "/api/orders/**").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.PUT, "/api/orders/**").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.DELETE, "/api/orders/**").hasRole("ADMIN")
                                                .anyRequest().authenticated())
                                .csrf(AbstractHttpConfigurer::disable)
                                .cors(withDefaults())
                                .httpBasic(withDefaults());
                return http.build();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
                UserDetails viewer = User.builder()
                                .username("viewer")
                                .password(passwordEncoder.encode("password"))
                                .roles("VIEWER")
                                .build();

                UserDetails admin = User.builder()
                                .username("admin")
                                .password(passwordEncoder.encode("password"))
                                .roles("ADMIN")
                                .build();

                return new InMemoryUserDetailsManager(viewer, admin);
        }
}
