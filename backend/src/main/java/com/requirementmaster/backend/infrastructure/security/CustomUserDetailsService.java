package com.requirementmaster.backend.infrastructure.security;

import com.requirementmaster.backend.domain.entities.User;
import com.requirementmaster.backend.infrastructure.persistence.repository.JpaUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final JpaUserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        // Permite login con email o username
        User user = userRepository.findByEmail(login.trim().toLowerCase())
                .orElseGet(() -> userRepository.findByUsername(login.trim())
                        .orElseThrow(() -> new UsernameNotFoundException(
                                "Usuario no encontrado con email/username: " + login)));

        return UserPrincipal.create(user);
    }

    @Transactional(readOnly = true)
    public UserDetails loadUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con id: " + id));

        return UserPrincipal.create(user);
    }
}