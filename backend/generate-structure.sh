#!/bin/bash

# =====================================================
# Script para generar la estructura completa del backend
# Requirement Master - Backend con Spring Boot
# Ejecutar desde la carpeta raíz 'backend/'
# =====================================================

set -e  # Detener si hay error

BASE_PKG="src/main/java/com/requirementmaster/backend"

# Verificar que estamos en el directorio correcto
if [ ! -d "src/main/java" ]; then
    echo "❌ Error: No se encuentra src/main/java"
    echo "Ejecuta este script desde la raíz del proyecto backend/ (donde está pom.xml)"
    exit 1
fi

cd "$BASE_PKG" || { echo "No se pudo acceder a $BASE_PKG"; exit 1; }

echo "📁 Creando estructura de directorios..."

# Crear todas las carpetas necesarias
mkdir -p config
mkdir -p security
mkdir -p domain/entities
mkdir -p domain/enums
mkdir -p domain/exceptions
mkdir -p application/service
mkdir -p application/dto/request
mkdir -p application/dto/response
mkdir -p application/mappers
mkdir -p infrastructure/persistence/repository
mkdir -p infrastructure/external
mkdir -p web/controllers
mkdir -p web/advice
mkdir -p web/validators
mkdir -p shared/constants
mkdir -p shared/utils

echo "✅ Estructura de carpetas creada"
echo "📝 Generando archivos Java..."

# =============================================
# CONFIG
# =============================================

cat > config/OpenApiConfig.java << 'EOF'
package com.requirementmaster.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Requirement Master API")
                .version("1.0")
                .description("API para la plataforma educativa de levantamiento de requerimientos")
                .contact(new Contact().name("Requirement Master Team").email("support@requirementmaster.com"))
            );
    }
}
EOF

cat > config/CorsConfig.java << 'EOF'
package com.requirementmaster.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5173", "http://localhost:19006")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
EOF

cat > config/WebMvcConfig.java << 'EOF'
package com.requirementmaster.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    // Configuraciones adicionales de MVC
}
EOF

# =============================================
# SECURITY
# =============================================

cat > security/SecurityConfig.java << 'EOF'
package com.requirementmaster.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter, CustomUserDetailsService userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configure(http))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/api/health", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
EOF

cat > security/JwtService.java << 'EOF'
package com.requirementmaster.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String username) {
        return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}
EOF

cat > security/JwtAuthFilter.java << 'EOF'
package com.requirementmaster.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthFilter(JwtService jwtService, CustomUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtService.validateToken(token)) {
                String username = jwtService.extractUsername(token);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        chain.doFilter(request, response);
    }
}
EOF

cat > security/CustomUserDetailsService.java << 'EOF'
package com.requirementmaster.backend.security;

import com.requirementmaster.backend.infrastructure.persistence.repository.JpaUserRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final JpaUserRepository userRepository;

    public CustomUserDetailsService(JpaUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
            .map(user -> User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build())
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }
}
EOF

# =============================================
# DOMAIN - ENTITIES
# =============================================

cat > domain/entities/User.java << 'EOF'
package com.requirementmaster.backend.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "total_xp")
    private Integer totalXp = 0;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
EOF

cat > domain/entities/Lesson.java << 'EOF'
package com.requirementmaster.backend.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "lessons")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code; // "1.1", "1.2", ..., "exam"

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String objective;

    @Column(columnDefinition = "TEXT")
    private String theory;

    private Integer orderNumber;

    @Column(name = "required_xp")
    private Integer requiredXp = 0;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL)
    private List<Activity> activities;
}
EOF

cat > domain/entities/Activity.java << 'EOF'
package com.requirementmaster.backend.domain.entities;

import com.fasterxml.jackson.databind.JsonNode;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;

@Entity
@Table(name = "activities")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    private ActivityType type;

    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficulty;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private JsonNode config;          // Configuración específica de la actividad (preguntas, opciones, etc.)

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private JsonNode expectedAnswer;   // Respuesta esperada (formato variable)

    private Integer maxScore;
    private Integer xpReward;
}
EOF

cat > domain/entities/UserProgress.java << 'EOF'
package com.requirementmaster.backend.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_progress")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    @ManyToOne
    @JoinColumn(name = "activity_id")
    private Activity activity;

    private Boolean completed;
    private Integer score;
    private Integer xpEarned;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        if (completed != null && completed && completedAt == null) {
            completedAt = LocalDateTime.now();
        }
    }
}
EOF

cat > domain/entities/Exam.java << 'EOF'
package com.requirementmaster.backend.domain.entities;

import com.fasterxml.jackson.databind.JsonNode;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;

@Entity
@Table(name = "exams")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private JsonNode questions;   // Lista de preguntas con opciones

    private Integer passingScore;
}
EOF

cat > domain/entities/ExamResult.java << 'EOF'
package com.requirementmaster.backend.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "exam_results")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "exam_id")
    private Exam exam;

    private Integer score;
    private Boolean passed;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        completedAt = LocalDateTime.now();
    }
}
EOF

# =============================================
# DOMAIN - ENUMS
# =============================================

cat > domain/enums/Role.java << 'EOF'
package com.requirementmaster.backend.domain.enums;

public enum Role {
    USER, ADMIN
}
EOF

cat > domain/enums/ActivityType.java << 'EOF'
package com.requirementmaster.backend.domain.enums;

public enum ActivityType {
    TRUE_FALSE,
    MULTIPLE_CHOICE,
    DRAG_DROP,
    SWIPE_CARDS,
    VENN_DIAGRAM,
    ORDER_STEPS,
    TEXT_REWRITE,
    CONSTRUCTOR_STORY,
    CLASSIFY_COLUMNS,
    BRANCHED_DIALOGUE
}
EOF

cat > domain/enums/DifficultyLevel.java << 'EOF'
package com.requirementmaster.backend.domain.enums;

public enum DifficultyLevel {
    EASY, MEDIUM, HARD
}
EOF

# =============================================
# DOMAIN - EXCEPTIONS
# =============================================

cat > domain/exceptions/BusinessException.java << 'EOF'
package com.requirementmaster.backend.domain.exceptions;

public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
EOF

cat > domain/exceptions/ResourceNotFoundException.java << 'EOF'
package com.requirementmaster.backend.domain.exceptions;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
EOF

# =============================================
# APPLICATION - SERVICES (INTERFACES)
# =============================================

cat > application/service/AuthService.java << 'EOF'
package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.request.LoginRequest;
import com.requirementmaster.backend.application.dto.request.RegisterRequest;
import com.requirementmaster.backend.application.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
}
EOF

cat > application/service/LessonService.java << 'EOF'
package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.response.LessonResponse;
import java.util.List;

public interface LessonService {
    List<LessonResponse> getAllLessons();
    LessonResponse getLessonById(Long id);
}
EOF

cat > application/service/ActivityService.java << 'EOF'
package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.request.ActivityAnswerRequest;
import com.requirementmaster.backend.application.dto.response.ActivityResponse;

public interface ActivityService {
    ActivityResponse validateAnswer(Long activityId, ActivityAnswerRequest request);
}
EOF

cat > application/service/ProgressService.java << 'EOF'
package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.response.DashboardResponse;
import com.requirementmaster.backend.application.dto.response.ProgressResponse;

public interface ProgressService {
    ProgressResponse getUserProgress(Long userId);
    DashboardResponse getDashboard(Long userId);
}
EOF

cat > application/service/ExamService.java << 'EOF'
package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.request.ExamSubmissionRequest;
import com.requirementmaster.backend.application.dto.response.ExamResultResponse;

public interface ExamService {
    ExamResultResponse submitExam(ExamSubmissionRequest request);
    ExamResultResponse getExamResult(Long userId);
}
EOF

# =============================================
# APPLICATION - SERVICES IMPLEMENTATIONS
# =============================================

cat > application/service/AuthServiceImpl.java << 'EOF'
package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.request.LoginRequest;
import com.requirementmaster.backend.application.dto.request.RegisterRequest;
import com.requirementmaster.backend.application.dto.response.AuthResponse;
import com.requirementmaster.backend.domain.entities.User;
import com.requirementmaster.backend.domain.enums.Role;
import com.requirementmaster.backend.infrastructure.persistence.repository.JpaUserRepository;
import com.requirementmaster.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final JpaUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(JpaUserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        User user = User.builder()
            .name(request.getName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(Role.USER)
            .totalXp(0)
            .build();
        user = userRepository.save(user);
        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }
}
EOF

cat > application/service/LessonServiceImpl.java << 'EOF'
package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.response.LessonResponse;
import com.requirementmaster.backend.application.mappers.LessonMapper;
import com.requirementmaster.backend.infrastructure.persistence.repository.JpaLessonRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LessonServiceImpl implements LessonService {

    private final JpaLessonRepository lessonRepository;
    private final LessonMapper lessonMapper;

    public LessonServiceImpl(JpaLessonRepository lessonRepository, LessonMapper lessonMapper) {
        this.lessonRepository = lessonRepository;
        this.lessonMapper = lessonMapper;
    }

    @Override
    public List<LessonResponse> getAllLessons() {
        return lessonRepository.findAllByOrderByOrderNumberAsc()
            .stream()
            .map(lessonMapper::toResponse)
            .collect(Collectors.toList());
    }

    @Override
    public LessonResponse getLessonById(Long id) {
        return lessonRepository.findById(id)
            .map(lessonMapper::toResponse)
            .orElseThrow(() -> new RuntimeException("Lesson not found"));
    }
}
EOF

cat > application/service/ActivityServiceImpl.java << 'EOF'
package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.request.ActivityAnswerRequest;
import com.requirementmaster.backend.application.dto.response.ActivityResponse;
import com.requirementmaster.backend.domain.entities.Activity;
import com.requirementmaster.backend.infrastructure.persistence.repository.JpaActivityRepository;
import org.springframework.stereotype.Service;

@Service
public class ActivityServiceImpl implements ActivityService {

    private final JpaActivityRepository activityRepository;

    public ActivityServiceImpl(JpaActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    @Override
    public ActivityResponse validateAnswer(Long activityId, ActivityAnswerRequest request) {
        Activity activity = activityRepository.findById(activityId)
            .orElseThrow(() -> new RuntimeException("Activity not found"));
        // Aquí iría la lógica de validación según el tipo de actividad
        boolean correct = false; // Placeholder
        int score = correct ? activity.getMaxScore() : 0;
        int xp = correct ? activity.getXpReward() : 0;
        return ActivityResponse.builder()
            .correct(correct)
            .score(score)
            .xpEarned(xp)
            .feedback(correct ? "¡Correcto!" : "Incorrecto. Intenta de nuevo.")
            .build();
    }
}
EOF

cat > application/service/ProgressServiceImpl.java << 'EOF'
package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.response.DashboardResponse;
import com.requirementmaster.backend.application.dto.response.ProgressResponse;
import com.requirementmaster.backend.infrastructure.persistence.repository.JpaProgressRepository;
import org.springframework.stereotype.Service;

@Service
public class ProgressServiceImpl implements ProgressService {

    private final JpaProgressRepository progressRepository;

    public ProgressServiceImpl(JpaProgressRepository progressRepository) {
        this.progressRepository = progressRepository;
    }

    @Override
    public ProgressResponse getUserProgress(Long userId) {
        // Placeholder
        return new ProgressResponse();
    }

    @Override
    public DashboardResponse getDashboard(Long userId) {
        // Placeholder
        return new DashboardResponse();
    }
}
EOF

cat > application/service/ExamServiceImpl.java << 'EOF'
package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.request.ExamSubmissionRequest;
import com.requirementmaster.backend.application.dto.response.ExamResultResponse;
import com.requirementmaster.backend.infrastructure.persistence.repository.JpaExamRepository;
import org.springframework.stereotype.Service;

@Service
public class ExamServiceImpl implements ExamService {

    private final JpaExamRepository examRepository;

    public ExamServiceImpl(JpaExamRepository examRepository) {
        this.examRepository = examRepository;
    }

    @Override
    public ExamResultResponse submitExam(ExamSubmissionRequest request) {
        // Placeholder
        return new ExamResultResponse();
    }

    @Override
    public ExamResultResponse getExamResult(Long userId) {
        // Placeholder
        return new ExamResultResponse();
    }
}
EOF

# =============================================
# APPLICATION - DTOs
# =============================================

cat > application/dto/request/LoginRequest.java << 'EOF'
package com.requirementmaster.backend.application.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank @Email
    private String email;
    @NotBlank
    private String password;
}
EOF

cat > application/dto/request/RegisterRequest.java << 'EOF'
package com.requirementmaster.backend.application.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String name;
    @NotBlank @Email
    private String email;
    @NotBlank
    private String password;
}
EOF

cat > application/dto/request/ActivityAnswerRequest.java << 'EOF'
package com.requirementmaster.backend.application.dto.request;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;

@Data
public class ActivityAnswerRequest {
    private Long userId;
    private JsonNode answer;
}
EOF

cat > application/dto/request/ExamSubmissionRequest.java << 'EOF'
package com.requirementmaster.backend.application.dto.request;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;

@Data
public class ExamSubmissionRequest {
    private Long userId;
    private Long examId;
    private JsonNode answers;
}
EOF

cat > application/dto/response/AuthResponse.java << 'EOF'
package com.requirementmaster.backend.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long userId;
    private String name;
    private String email;
    private String role;
}
EOF

cat > application/dto/response/LessonResponse.java << 'EOF'
package com.requirementmaster.backend.application.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class LessonResponse {
    private Long id;
    private String code;
    private String title;
    private String objective;
    private String theory;
    private Integer orderNumber;
    private Integer requiredXp;
    private List<ActivityResponse> activities;
}
EOF

cat > application/dto/response/ActivityResponse.java << 'EOF'
package com.requirementmaster.backend.application.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ActivityResponse {
    private boolean correct;
    private int score;
    private int xpEarned;
    private String feedback;
}
EOF

cat > application/dto/response/ProgressResponse.java << 'EOF'
package com.requirementmaster.backend.application.dto.response;

import lombok.Data;

@Data
public class ProgressResponse {
    // Placeholder
}
EOF

cat > application/dto/response/DashboardResponse.java << 'EOF'
package com.requirementmaster.backend.application.dto.response;

import lombok.Data;

@Data
public class DashboardResponse {
    // Placeholder
}
EOF

cat > application/dto/response/ExamResultResponse.java << 'EOF'
package com.requirementmaster.backend.application.dto.response;

import lombok.Data;

@Data
public class ExamResultResponse {
    // Placeholder
}
EOF

# =============================================
# APPLICATION - MAPPER (interfaces MapStruct)
# =============================================

cat > application/mappers/UserMapper.java << 'EOF'
package com.requirementmaster.backend.application.mappers;

import com.requirementmaster.backend.domain.entities.User;
import com.requirementmaster.backend.application.dto.response.AuthResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    AuthResponse toAuthResponse(User user, String token);
}
EOF

cat > application/mappers/LessonMapper.java << 'EOF'
package com.requirementmaster.backend.application.mappers;

import com.requirementmaster.backend.domain.entities.Lesson;
import com.requirementmaster.backend.application.dto.response.LessonResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LessonMapper {
    LessonResponse toResponse(Lesson lesson);
}
EOF

cat > application/mappers/ActivityMapper.java << 'EOF'
package com.requirementmaster.backend.application.mappers;

import com.requirementmaster.backend.domain.entities.Activity;
import com.requirementmaster.backend.application.dto.response.ActivityResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ActivityMapper {
    ActivityResponse toResponse(Activity activity, boolean correct, int score, int xp);
}
EOF

# =============================================
# INFRASTRUCTURE - REPOSITORIES (Spring Data JPA)
# =============================================

cat > infrastructure/persistence/repository/JpaUserRepository.java << 'EOF'
package com.requirementmaster.backend.infrastructure.persistence.repository;

import com.requirementmaster.backend.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface JpaUserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
EOF

cat > infrastructure/persistence/repository/JpaLessonRepository.java << 'EOF'
package com.requirementmaster.backend.infrastructure.persistence.repository;

import com.requirementmaster.backend.domain.entities.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JpaLessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findAllByOrderByOrderNumberAsc();
}
EOF

cat > infrastructure/persistence/repository/JpaActivityRepository.java << 'EOF'
package com.requirementmaster.backend.infrastructure.persistence.repository;

import com.requirementmaster.backend.domain.entities.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JpaActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByLessonId(Long lessonId);
}
EOF

cat > infrastructure/persistence/repository/JpaProgressRepository.java << 'EOF'
package com.requirementmaster.backend.infrastructure.persistence.repository;

import com.requirementmaster.backend.domain.entities.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaProgressRepository extends JpaRepository<UserProgress, Long> {
}
EOF

cat > infrastructure/persistence/repository/JpaExamRepository.java << 'EOF'
package com.requirementmaster.backend.infrastructure.persistence.repository;

import com.requirementmaster.backend.domain.entities.Exam;
import com.requirementmaster.backend.domain.entities.ExamResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface JpaExamRepository extends JpaRepository<Exam, Long> {
}

interface JpaExamResultRepository extends JpaRepository<ExamResult, Long> {
    Optional<ExamResult> findByUserIdAndExamId(Long userId, Long examId);
}
EOF

# =============================================
# INFRASTRUCTURE - EXTERNAL SERVICES
# =============================================

cat > infrastructure/external/ScormGenerator.java << 'EOF'
package com.requirementmaster.backend.infrastructure.external;

import org.springframework.stereotype.Component;

@Component
public class ScormGenerator {
    public String generateScormPackage(Long userId) {
        // Lógica para generar SCORM
        return "scorm_package_path";
    }
}
EOF

cat > infrastructure/external/PdfReportGenerator.java << 'EOF'
package com.requirementmaster.backend.infrastructure.external;

import org.springframework.stereotype.Component;

@Component
public class PdfReportGenerator {
    public byte[] generateProgressReport(Long userId) {
        // Generar PDF con reporte
        return new byte[0];
    }
}
EOF

# =============================================
# WEB - CONTROLLERS
# =============================================

cat > web/controllers/AuthController.java << 'EOF'
package com.requirementmaster.backend.web.controllers;

import com.requirementmaster.backend.application.dto.request.LoginRequest;
import com.requirementmaster.backend.application.dto.request.RegisterRequest;
import com.requirementmaster.backend.application.dto.response.AuthResponse;
import com.requirementmaster.backend.application.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
}
EOF

cat > web/controllers/LessonController.java << 'EOF'
package com.requirementmaster.backend.web.controllers;

import com.requirementmaster.backend.application.dto.response.LessonResponse;
import com.requirementmaster.backend.application.service.LessonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @GetMapping
    public ResponseEntity<List<LessonResponse>> getAllLessons() {
        return ResponseEntity.ok(lessonService.getAllLessons());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LessonResponse> getLessonById(@PathVariable Long id) {
        return ResponseEntity.ok(lessonService.getLessonById(id));
    }
}
EOF

cat > web/controllers/ActivityController.java << 'EOF'
package com.requirementmaster.backend.web.controllers;

import com.requirementmaster.backend.application.dto.request.ActivityAnswerRequest;
import com.requirementmaster.backend.application.dto.response.ActivityResponse;
import com.requirementmaster.backend.application.service.ActivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @PostMapping("/{id}/validate")
    public ResponseEntity<ActivityResponse> validate(@PathVariable Long id,
                                                     @RequestBody ActivityAnswerRequest request) {
        return ResponseEntity.ok(activityService.validateAnswer(id, request));
    }
}
EOF

cat > web/controllers/ProgressController.java << 'EOF'
package com.requirementmaster.backend.web.controllers;

import com.requirementmaster.backend.application.dto.response.DashboardResponse;
import com.requirementmaster.backend.application.dto.response.ProgressResponse;
import com.requirementmaster.backend.application.service.ProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ProgressResponse> getUserProgress(@PathVariable Long userId) {
        return ResponseEntity.ok(progressService.getUserProgress(userId));
    }

    @GetMapping("/dashboard/{userId}")
    public ResponseEntity<DashboardResponse> getDashboard(@PathVariable Long userId) {
        return ResponseEntity.ok(progressService.getDashboard(userId));
    }
}
EOF

cat > web/controllers/ExamController.java << 'EOF'
package com.requirementmaster.backend.web.controllers;

import com.requirementmaster.backend.application.dto.request.ExamSubmissionRequest;
import com.requirementmaster.backend.application.dto.response.ExamResultResponse;
import com.requirementmaster.backend.application.service.ExamService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @PostMapping("/submit")
    public ResponseEntity<ExamResultResponse> submit(@RequestBody ExamSubmissionRequest request) {
        return ResponseEntity.ok(examService.submitExam(request));
    }

    @GetMapping("/result/{userId}")
    public ResponseEntity<ExamResultResponse> getResult(@PathVariable Long userId) {
        return ResponseEntity.ok(examService.getExamResult(userId));
    }
}
EOF

cat > web/controllers/HealthController.java << 'EOF'
package com.requirementmaster.backend.web.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "Requirement Master Backend");
        return ResponseEntity.ok(status);
    }
}
EOF

# =============================================
# WEB - ADVICE (GlobalExceptionHandler)
# =============================================

cat > web/advice/GlobalExceptionHandler.java << 'EOF'
package com.requirementmaster.backend.web.advice;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
EOF

# =============================================
# WEB - VALIDATORS
# =============================================

cat > web/validators/UniqueEmailValidator.java << 'EOF'
package com.requirementmaster.backend.web.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {
    // Implementación con llamada al repositorio
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        // Placeholder - se debe inyectar repositorio
        return true;
    }
}
EOF

# Necesitamos la anotación personalizada
cat > web/validators/UniqueEmail.java << 'EOF'
package com.requirementmaster.backend.web.validators;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UniqueEmailValidator.class)
@Documented
public @interface UniqueEmail {
    String message() default "Email already exists";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
EOF

# =============================================
# SHARED - CONSTANTS & UTILS
# =============================================

cat > shared/constants/ApiConstants.java << 'EOF'
package com.requirementmaster.backend.shared.constants;

public final class ApiConstants {
    public static final String API_VERSION = "/api/v1";
    public static final String AUTH_PATH = API_VERSION + "/auth";
    private ApiConstants() {}
}
EOF

cat > shared/constants/ErrorConstants.java << 'EOF'
package com.requirementmaster.backend.shared.constants;

public final class ErrorConstants {
    public static final String USER_NOT_FOUND = "User not found";
    public static final String INVALID_CREDENTIALS = "Invalid credentials";
    private ErrorConstants() {}
}
EOF

cat > shared/utils/ValidationUtils.java << 'EOF'
package com.requirementmaster.backend.shared.utils;

public final class ValidationUtils {
    private ValidationUtils() {}
    public static boolean isValidEmail(String email) {
        return email != null && email.matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
    }
}
EOF

cat > shared/utils/DateUtils.java << 'EOF'
package com.requirementmaster.backend.shared.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class DateUtils {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
    private DateUtils() {}
    public static String format(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(FORMATTER) : null;
    }
}
EOF

# =============================================
# MAIN APPLICATION CLASS (si no existe o actualizar)
# =============================================
# Volvemos a la raíz del proyecto para asegurar BackendApplication.java
cd ../../../../..  # Estamos en backend/src/main/java/com/requirementmaster/backend, subimos 5 niveles hasta backend/

if [ ! -f "src/main/java/com/requirementmaster/backend/BackendApplication.java" ]; then
    cat > src/main/java/com/requirementmaster/backend/BackendApplication.java << 'EOF'
package com.requirementmaster.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}
EOF
    echo "✅ BackendApplication.java creado"
else
    echo "ℹ️ BackendApplication.java ya existe, no se modifica"
fi

echo ""
echo "🎉 ¡Estructura backend generada completamente!"
echo "📌 Siguientes pasos:"
echo "1. Ejecuta 'mvn clean install' para descargar dependencias"
echo "2. Configura application.properties o application.yml con tu base de datos Supabase"
echo "3. Ejecuta 'mvn spring-boot:run' para levantar el servidor"