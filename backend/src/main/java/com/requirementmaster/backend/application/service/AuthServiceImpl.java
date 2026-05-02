//package com.requirementmaster.backend.application.service;
//
//import com.requirementmaster.backend.application.dto.request.LoginRequest;
//import com.requirementmaster.backend.application.dto.request.RegisterRequest;
//import com.requirementmaster.backend.application.dto.response.AuthResponse;
//import com.requirementmaster.backend.domain.entities.User;
//import com.requirementmaster.backend.domain.enums.Role;
//import com.requirementmaster.backend.infrastructure.persistence.repository.JpaUserRepository;
//import com.requirementmaster.backend.security.JwtService;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//@Service
//public class AuthServiceImpl implements AuthService {
//
//    private final JpaUserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//    private final JwtService jwtService;
//
//    public AuthServiceImpl(JpaUserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
//        this.userRepository = userRepository;
//        this.passwordEncoder = passwordEncoder;
//        this.jwtService = jwtService;
//    }
//
//    @Override
//    public AuthResponse login(LoginRequest request) {
//        User user = userRepository.findByEmail(request.getEmail())
//            .orElseThrow(() -> new RuntimeException("Invalid credentials"));
//        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
//            throw new RuntimeException("Invalid credentials");
//        }
//        String token = jwtService.generateToken(user.getEmail());
//        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
//    }
//
//    @Override
//    public AuthResponse register(RegisterRequest request) {
//        if (userRepository.existsByEmail(request.getEmail())) {
//            throw new RuntimeException("Email already exists");
//        }
//        User user = User.builder()
//            .name(request.getName())
//            .email(request.getEmail())
//            .password(passwordEncoder.encode(request.getPassword()))
//            .role(Role.USER)
//            .totalXp(0)
//            .build();
//        user = userRepository.save(user);
//        String token = jwtService.generateToken(user.getEmail());
//        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
//    }
//}
