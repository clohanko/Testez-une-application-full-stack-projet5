package com.openclassrooms.starterjwt.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.util.NestedServletException;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
@Transactional
public class AuthIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    private final String testEmail = "auth@test.com";

    @Test
    void shouldRegisterNewUser() throws Exception {
        SignupRequest req = new SignupRequest();
        req.setEmail(testEmail);
        req.setPassword("password123");
        req.setFirstName("John");
        req.setLastName("Doe");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }

    @Test
    void shouldReturnErrorIfEmailAlreadyUsed() throws Exception {
        SignupRequest req = new SignupRequest();
        req.setEmail(testEmail);
        req.setPassword("password123");
        req.setFirstName("John");
        req.setLastName("Doe");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldLoginWithValidCredentials() throws Exception {
        SignupRequest req = new SignupRequest();
        req.setEmail(testEmail);
        req.setPassword("password123");
        req.setFirstName("John");
        req.setLastName("Doe");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());

        LoginRequest login = new LoginRequest();
        login.setEmail(testEmail);
        login.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk());
    }

    @Test
    void shouldFailLoginWithInvalidPassword() {
        SignupRequest req = new SignupRequest();
        req.setEmail(testEmail);
        req.setPassword("password123");
        req.setFirstName("John");
        req.setLastName("Doe");

        // création de l’utilisateur
        try {
            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isOk());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        LoginRequest badLogin = new LoginRequest();
        badLogin.setEmail(testEmail);
        badLogin.setPassword("wrongPassword");

        // On attend que l'appel lève une NestedServletException (BadCredentials inside)
        assertThrows(NestedServletException.class, () -> {
            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(badLogin)))
                    .andReturn();
        });
    }
}
