package com.origin.flo;

import com.origin.flo.model.User;
import com.origin.flo.service.UserService;
import com.origin.flo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    public void setup() {
        userRepository.deleteAll();
    }

    @Test
    public void testRegister() {
        userService.register("test@example.com", "password");
        User user = userRepository.findByEmail("test@example.com").orElse(null);
        assertNotNull(user);
        assertEquals("test@example.com", user.getEmail());
        assertTrue(passwordEncoder.matches("password", user.getPassword()));
    }

    @Test
    public void testAuthenticate() {
        userService.register("test@example.com", "password");
        User user = userService.authenticate("test@example.com", "password");
        assertNotNull(user);
        assertEquals("test@example.com", user.getEmail());
    }
}