package com.ecommerce.ordermanagement.config;

import com.ecommerce.ordermanagement.domain.Role;
import com.ecommerce.ordermanagement.domain.User;
import com.ecommerce.ordermanagement.repository.RoleRepository;
import com.ecommerce.ordermanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role("ROLE_ADMIN"));
            roleRepository.save(new Role("ROLE_VIEWER"));
        }

        if (userRepository.count() == 0) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN").get();
            Role viewerRole = roleRepository.findByName("ROLE_VIEWER").get();

            User admin = new User("admin", passwordEncoder.encode("password"));
            admin.setRoles(Set.of(adminRole));
            userRepository.save(admin);

            User viewer = new User("viewer", passwordEncoder.encode("password"));
            viewer.setRoles(Set.of(viewerRole));
            userRepository.save(viewer);
        }
    }
}
