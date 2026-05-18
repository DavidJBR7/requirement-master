
```
requirement-master
├─ backend
│  ├─ Dockerfile
│  ├─ logs
│  ├─ mvnw
│  ├─ mvnw.cmd
│  ├─ pom.xml
│  └─ src
│     ├─ main
│     │  ├─ java
│     │  │  └─ com
│     │  │     └─ requirementmaster
│     │  │        └─ backend
│     │  │           ├─ application
│     │  │           │  ├─ dto
│     │  │           │  │  ├─ request
│     │  │           │  │  │  ├─ ActivityAnswerRequest.java
│     │  │           │  │  │  ├─ ForgotPasswordRequest.java
│     │  │           │  │  │  ├─ LoginRequest.java
│     │  │           │  │  │  ├─ RefreshTokenRequest.java
│     │  │           │  │  │  ├─ RegisterRequest.java
│     │  │           │  │  │  └─ ResetPasswordRequest.java
│     │  │           │  │  └─ response
│     │  │           │  │     ├─ ActivityFullResponse.java
│     │  │           │  │     ├─ ActivityProgressResponse.java
│     │  │           │  │     ├─ AnswerRecordResponse.java
│     │  │           │  │     ├─ AuthResponse.java
│     │  │           │  │     ├─ ErrorResponse.java
│     │  │           │  │     ├─ LessonDetailResponse.java
│     │  │           │  │     ├─ LessonProgressResponse.java
│     │  │           │  │     ├─ LessonResultResponse.java
│     │  │           │  │     ├─ MessageResponse.java
│     │  │           │  │     └─ RoadmapLessonResponse.java
│     │  │           │  └─ service
│     │  │           │     ├─ ActivityService.java
│     │  │           │     ├─ AuthService.java
│     │  │           │     ├─ EmailService.java
│     │  │           │     ├─ LessonService.java
│     │  │           │     ├─ ProgressService.java
│     │  │           │     └─ RefreshTokenService.java
│     │  │           ├─ BackendApplication.java
│     │  │           ├─ domain
│     │  │           │  ├─ entities
│     │  │           │  │  ├─ Activity.java
│     │  │           │  │  ├─ ActivityProgress.java
│     │  │           │  │  ├─ AnswerRecord.java
│     │  │           │  │  ├─ GlobalProgress.java
│     │  │           │  │  ├─ Lesson.java
│     │  │           │  │  ├─ LessonProgress.java
│     │  │           │  │  ├─ PasswordResetToken.java
│     │  │           │  │  ├─ RefreshToken.java
│     │  │           │  │  └─ User.java
│     │  │           │  ├─ enums
│     │  │           │  │  └─ ActivityType.java
│     │  │           │  └─ exceptions
│     │  │           │     ├─ BusinessException.java
│     │  │           │     └─ ResourceNotFoundException.java
│     │  │           ├─ infrastructure
│     │  │           │  ├─ persistence
│     │  │           │  │  └─ repository
│     │  │           │  │     ├─ JpaActivityProgressRepository.java
│     │  │           │  │     ├─ JpaActivityRepository.java
│     │  │           │  │     ├─ JpaAnswerRecordRepository.java
│     │  │           │  │     ├─ JpaGlobalProgressRepository.java
│     │  │           │  │     ├─ JpaLessonProgressRepository.java
│     │  │           │  │     ├─ JpaLessonRepository.java
│     │  │           │  │     ├─ JpaPasswordResetTokenRepository.java
│     │  │           │  │     ├─ JpaRefreshTokenRepository.java
│     │  │           │  │     └─ JpaUserRepository.java
│     │  │           │  ├─ security
│     │  │           │  │  ├─ CustomUserDetailsService.java
│     │  │           │  │  ├─ JwtAuthFilter.java
│     │  │           │  │  ├─ JwtTokenProvider.java
│     │  │           │  │  ├─ SecurityConfig.java
│     │  │           │  │  └─ UserPrincipal.java
│     │  │           │  └─ web
│     │  │           │     ├─ advice
│     │  │           │     │  └─ GlobalExceptionHandler.java
│     │  │           │     └─ controllers
│     │  │           │        ├─ ActivityController.java
│     │  │           │        ├─ AuthController.java
│     │  │           │        ├─ LessonController.java
│     │  │           │        └─ ProgressController.java
│     │  │           └─ shared
│     │  │              └─ constants
│     │  │                 └─ ErrorConstants.java
│     │  └─ resources
│     │     ├─ application.yml
│     │     ├─ db
│     │     │  └─ migration
│     │     │     ├─ V10__seed_lessons_and_activities.sql
│     │     │     ├─ V1__create_users_table.sql
│     │     │     ├─ V2__create_refresh_tokens_table.sql
│     │     │     ├─ V3__create_password_reset_tokens_table.sql
│     │     │     ├─ V4__create_lessons_table.sql
│     │     │     ├─ V5__create_activities_table.sql
│     │     │     ├─ V6__create_lesson_progress_table.sql
│     │     │     ├─ V7__create_activity_progress_table.sql
│     │     │     ├─ V8__create_answer_records_table.sql
│     │     │     └─ V9__create_global_progress_table.sql
│     │     ├─ static
│     │     └─ templates
│     └─ test
│        └─ java
│           └─ com
│              └─ requirementmaster
│                 └─ backend
│                    ├─ BackendApplicationTests.java
│                    ├─ e2e
│                    ├─ integration
│                    │  ├─ persistence
│                    │  └─ web
│                    └─ unit
│                       ├─ application
│                       └─ domain
│                          └─ entities
├─ config
├─ docker
│  ├─ backend.Dockerfile
│  └─ docker-compose.yml
├─ docs
│  └─ Gemini_Generated_Image_ktbilqktbilqktbi.svg
├─ frontend-mobile
│  ├─ src
│  │  ├─ components
│  │  ├─ screens
│  │  ├─ services
│  │  └─ store
│  └─ tests
├─ frontend-web
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ app
│  │  │  ├─ providers.jsx
│  │  │  └─ router.jsx
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  └─ logo.svg
│  │  ├─ features
│  │  │  ├─ auth
│  │  │  │  ├─ components
│  │  │  │  │  ├─ ForgotPasswordForm.jsx
│  │  │  │  │  ├─ LoginForm.jsx
│  │  │  │  │  ├─ RegisterForm.jsx
│  │  │  │  │  └─ ResetPasswordForm.jsx
│  │  │  │  ├─ hooks
│  │  │  │  │  └─ useAuth.js
│  │  │  │  └─ services
│  │  │  │     └─ authService.js
│  │  │  └─ lessons
│  │  │     ├─ components
│  │  │     │  ├─ ActivityFactory.jsx
│  │  │     │  ├─ FloatingFeedback.jsx
│  │  │     │  ├─ LessonResult.jsx
│  │  │     │  ├─ MatchPairsActivity.jsx
│  │  │     │  ├─ RoadmapCard.jsx
│  │  │     │  ├─ TheoryModal.jsx
│  │  │     │  ├─ TheoryView.jsx
│  │  │     │  └─ TrueFalseActivity.jsx
│  │  │     ├─ data
│  │  │     │  └─ lessonTheory.js
│  │  │     ├─ hooks
│  │  │     │  └─ useLesson.js
│  │  │     └─ services
│  │  │        ├─ activityService.js
│  │  │        ├─ lessonService.js
│  │  │        └─ progressService.js
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ DashboardPage.jsx
│  │  │  ├─ ForgotPasswordPage.jsx
│  │  │  ├─ HomePage.jsx
│  │  │  ├─ LessonPage.jsx
│  │  │  ├─ LoginPage.jsx
│  │  │  ├─ ProfilePage.jsx
│  │  │  ├─ RegisterPage.jsx
│  │  │  ├─ ResetPasswordPage.jsx
│  │  │  └─ RoadmapPage.jsx
│  │  ├─ services
│  │  │  └─ apiClient.js
│  │  ├─ shared
│  │  │  └─ components
│  │  │     ├─ AuthLayout.jsx
│  │  │     ├─ Button.jsx
│  │  │     ├─ GuestRoute.jsx
│  │  │     ├─ Input.jsx
│  │  │     ├─ Layout.jsx
│  │  │     ├─ LogoIcon.jsx
│  │  │     ├─ Modal.jsx
│  │  │     ├─ PasswordInput.jsx
│  │  │     └─ ProtectedRoute.jsx
│  │  ├─ store
│  │  │  ├─ authStore.js
│  │  │  └─ soundStore.js
│  │  ├─ styles
│  │  │  └─ index.css
│  │  └─ utils
│  ├─ tests
│  └─ vite.config.js
└─ README.md

```