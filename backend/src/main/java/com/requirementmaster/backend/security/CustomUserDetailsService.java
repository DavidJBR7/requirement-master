//package com.requirementmaster.backend.security;
//
//import com.requirementmaster.backend.infrastructure.persistence.repository.JpaUserRepository;
//import org.springframework.security.core.userdetails.User;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//@Service
//public class CustomUserDetailsService implements UserDetailsService {
//
//    private final JpaUserRepository userRepository;
//
//    public CustomUserDetailsService(JpaUserRepository userRepository) {
//        this.userRepository = userRepository;
//    }
//
//    @Override
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//        return userRepository.findByEmail(email)
//            .map(user -> User.builder()
//                .username(user.getEmail())
//                .password(user.getPassword())
//                .roles(user.getRole().name())
//                .build())
//            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
//    }
//}
