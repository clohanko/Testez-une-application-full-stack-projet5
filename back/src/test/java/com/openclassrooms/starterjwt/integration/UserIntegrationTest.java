package com.openclassrooms.starterjwt.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)  // on gère manuellement SecurityContext
@ActiveProfiles("test")
@Transactional
public class UserIntegrationTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired UserRepository userRepository;

    @Test
    void shouldReturnUserById() throws Exception {
        // GIVEN : un utilisateur en base
        User user = new User(
                "user@example.com",  // email
                "LastName",          // lastName
                "FirstName",         // firstName
                "somePassword",      // password (non utilisé ici)
                false                // admin flag
        );
        user = userRepository.save(user);

        // WHEN / THEN : GET /api/user/{id}
        mockMvc.perform(get("/api/user/" + user.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(user.getId()))
                .andExpect(jsonPath("$.email").value("user@example.com"));
    }

    @Test
    void shouldReturnBadRequestForInvalidIdFormat() throws Exception {
        mockMvc.perform(get("/api/user/abc"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnNotFoundForUnknownUser() throws Exception {
        mockMvc.perform(get("/api/user/9999"))
                .andExpect(status().isNotFound());
    }


    @Test
    void shouldReturnBadRequestWhenDeletingInvalidId() throws Exception {
        mockMvc.perform(delete("/api/user/abc"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnNotFoundWhenDeletingUnknownUser() throws Exception {
        // SIMULER une authentification quelconque
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("someone@example.com", null, Collections.emptyList())
        );

        mockMvc.perform(delete("/api/user/9999"))
                .andExpect(status().isNotFound());
    }
}
