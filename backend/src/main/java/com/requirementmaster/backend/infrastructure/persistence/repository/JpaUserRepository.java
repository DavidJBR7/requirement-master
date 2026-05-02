package com.requirementmaster.backend.infrastructure.persistence.repository;

import com.requirementmaster.backend.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface JpaUserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
