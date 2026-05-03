package com.requirementmaster.backend.infrastructure.persistence.repository;

import com.requirementmaster.backend.domain.entities.GlobalProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JpaGlobalProgressRepository extends JpaRepository<GlobalProgress, Long> {

    Optional<GlobalProgress> findByUserId(Long userId);
}