package com.requirementmaster.backend.infrastructure.security;

import com.requirementmaster.backend.domain.entities.User;
import com.requirementmaster.backend.domain.exceptions.ResourceNotFoundException;
import com.requirementmaster.backend.infrastructure.persistence.repository.JpaUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JpaUserRepository userRepository;

    /**
     * Obtiene el ID del usuario actualmente autenticado.
     */
    public Long getCurrentUserId() {
        UserPrincipal principal = getCurrentUserPrincipal();
        return principal.getId();
    }

    /**
     * Obtiene el usuario completo desde la base de datos.
     */
    @Transactional(readOnly = true)
    public User getCurrentUser() {
        Long userId = getCurrentUserId();
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
    }

    /**
     * Obtiene el principal del contexto de seguridad.
     */
    private UserPrincipal getCurrentUserPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No hay usuario autenticado");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof UserPrincipal) {
            return (UserPrincipal) principal;
        }

        throw new RuntimeException("Principal no es una instancia de UserPrincipal");
    }

    /**
     * Verifica si hay un usuario autenticado actualmente.
     */
    public boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null
                && authentication.isAuthenticated()
                && authentication.getPrincipal() instanceof UserPrincipal;
    }
}