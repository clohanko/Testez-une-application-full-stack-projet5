package com.openclassrooms.starterjwt.security.jwt;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtUtilsTest {

    private JwtUtils jwtUtils;

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        jwtUtils.jwtSecret = "secretKey";
        jwtUtils.jwtExpirationMs = 3600000; // 1h
    }

    @Test
    void testGenerateAndValidateToken() {
        // UserDetailsImpl(Long id, String username, String firstName, String lastName, Boolean admin, String password)
        UserDetailsImpl userDetails = new UserDetailsImpl(
                1L,
                "user@example.com",   // username
                "First",              // firstName
                "Last",               // lastName
                true,                 // admin
                "password123"         // password
        );

        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null);

        String token = jwtUtils.generateJwtToken(authentication);

        assertNotNull(token);
        assertTrue(jwtUtils.validateJwtToken(token));
        assertEquals("user@example.com", jwtUtils.getUserNameFromJwtToken(token));
    }

    @Test
    void testExpiredToken() {
        String expiredToken = Jwts.builder()
                .setSubject("expired@example.com")
                .setIssuedAt(new Date(System.currentTimeMillis() - 60000)) // issued 1 min ago
                .setExpiration(new Date(System.currentTimeMillis() - 1000)) // expired 1 sec ago
                .signWith(SignatureAlgorithm.HS512, jwtUtils.jwtSecret)
                .compact();

        // Doit lever une exception lors du parsing du nom d’utilisateur
        assertThrows(ExpiredJwtException.class, () -> {
            jwtUtils.getUserNameFromJwtToken(expiredToken);
        });

        // Et la validation doit échouer
        assertFalse(jwtUtils.validateJwtToken(expiredToken));
    }

    @Test
    void testGetUsernameFromToken() {
        String token = Jwts.builder()
                .setSubject("testuser@example.com")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 60000)) // expire dans 1 minute
                .signWith(SignatureAlgorithm.HS512, jwtUtils.jwtSecret)
                .compact();

        String username = jwtUtils.getUserNameFromJwtToken(token);
        assertEquals("testuser@example.com", username);
    }

    @Test
    void testMalformedToken() {
        String malformedToken = "this.is.not.a.valid.token";

        assertThrows(io.jsonwebtoken.MalformedJwtException.class, () -> {
            jwtUtils.getUserNameFromJwtToken(malformedToken);
        });

        assertFalse(jwtUtils.validateJwtToken(malformedToken));
    }

    @Test
    void testInvalidSignatureToken() {
        // Génère un token avec une autre clé secrète
        String fakeSecret = "fakeSecretKey";
        String token = Jwts.builder()
                .setSubject("user@example.com")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 60000))
                .signWith(SignatureAlgorithm.HS512, fakeSecret)
                .compact();

        assertThrows(io.jsonwebtoken.SignatureException.class, () -> {
            jwtUtils.getUserNameFromJwtToken(token);
        });

        assertFalse(jwtUtils.validateJwtToken(token));
    }

    @Test
    void testEmptyToken() {
        String emptyToken = "";

        assertThrows(IllegalArgumentException.class, () -> {
            jwtUtils.getUserNameFromJwtToken(emptyToken);
        });

        assertFalse(jwtUtils.validateJwtToken(emptyToken));
    }

}
