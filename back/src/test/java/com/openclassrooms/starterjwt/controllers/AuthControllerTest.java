package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    private AuthenticationManager authenticationManager;
    private JwtUtils jwtUtils;
    private PasswordEncoder passwordEncoder;
    private UserRepository userRepository;
    private AuthController authController;

    @BeforeEach
    void setUp() {
        authenticationManager = mock(AuthenticationManager.class);
        jwtUtils = mock(JwtUtils.class);
        passwordEncoder = mock(PasswordEncoder.class);
        userRepository = mock(UserRepository.class);
        authController = new AuthController(authenticationManager, passwordEncoder, jwtUtils, userRepository);
    }

    @Test
    void testAuthenticateUser_success() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password");

        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any())).thenReturn(authentication);

        UserDetailsImpl userDetails = new UserDetailsImpl(1L, "test@example.com", "First", "Last", true, "encodedPass");
        when(authentication.getPrincipal()).thenReturn(userDetails);

        when(jwtUtils.generateJwtToken(authentication)).thenReturn("jwt-token");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(new User()));

        ResponseEntity<?> response = authController.authenticateUser(loginRequest);

        assertTrue(response.getBody() instanceof JwtResponse);
        JwtResponse jwt = (JwtResponse) response.getBody();
        assertEquals("jwt-token", jwt.getToken());
    }

    @Test
    void testRegisterUser_emailTaken() {
        SignupRequest signUpRequest = new SignupRequest();
        signUpRequest.setEmail("taken@example.com");

        when(userRepository.existsByEmail("taken@example.com")).thenReturn(true);

        ResponseEntity<?> response = authController.registerUser(signUpRequest);

        assertTrue(response.getBody() instanceof MessageResponse);
        assertEquals("Error: Email is already taken!", ((MessageResponse) response.getBody()).getMessage());
    }

    @Test
    void testRegisterUser_success() {
        SignupRequest signUpRequest = new SignupRequest();
        signUpRequest.setEmail("new@example.com");
        signUpRequest.setPassword("password");
        signUpRequest.setFirstName("First");
        signUpRequest.setLastName("Last");

        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("hashed");

        ResponseEntity<?> response = authController.registerUser(signUpRequest);

        assertTrue(response.getBody() instanceof MessageResponse);
        assertEquals("User registered successfully!", ((MessageResponse) response.getBody()).getMessage());

        verify(userRepository, times(1)).save(any(User.class));
    }
}
