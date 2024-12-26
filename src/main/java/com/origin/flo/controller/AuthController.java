package com.origin.flo.controller;

import com.origin.flo.dto.LoginRequest;
import com.origin.flo.dto.RegisterRequest;
import com.origin.flo.model.User;
import com.origin.flo.service.UserService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:8000")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        userService.register(request.getEmail(), request.getPassword());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        System.out.println("Login request: " + request);
        User user = userService.authenticate(request.getEmail(), request.getPassword());
        if (user != null) {
            return ResponseEntity.ok().body(Map.of("message", "Login successful", "userId", user.getId()));
        } else {
            return ResponseEntity.status(401).body(Map.of("message", "Login Failed", "userMail", request.getEmail()));
        }
    }
}