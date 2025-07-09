package com.openclassrooms.starterjwt.security.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserDetailsServiceImplTest {

    private UserRepository userRepository;
    private UserDetailsServiceImpl service;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        service = new UserDetailsServiceImpl(userRepository);
    }

    @Test
    void testLoadUserByUsername_userExists() {
        // Arrange
        User user = new User();
        user.setId(1L);
        user.setEmail("user@example.com");
        user.setFirstName("First");
        user.setLastName("Last");
        user.setPassword("hashed_password");
        user.setAdmin(false);

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        // Act
        UserDetailsImpl result = (UserDetailsImpl) service.loadUserByUsername("user@example.com");

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("user@example.com", result.getUsername());
        assertEquals("First", result.getFirstName());
        assertEquals("Last", result.getLastName());
        assertEquals("hashed_password", result.getPassword());
    }

    @Test
    void testLoadUserByUsername_userNotFound() {
        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        UsernameNotFoundException exception = assertThrows(UsernameNotFoundException.class, () -> {
            service.loadUserByUsername("unknown@example.com");
        });

        assertEquals("User Not Found with email: unknown@example.com", exception.getMessage());
    }
}
