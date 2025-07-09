package com.openclassrooms.starterjwt.security.services;

import org.junit.jupiter.api.Test;

import java.util.Collection;

import static org.junit.jupiter.api.Assertions.*;

class UserDetailsImplTest {

    @Test
    void testGetters() {
        UserDetailsImpl user = new UserDetailsImpl(
                1L,
                "user@example.com",
                "First",
                "Last",
                true,
                "secret"
        );

        assertEquals(1L, user.getId());
        assertEquals("user@example.com", user.getUsername());
        assertEquals("First", user.getFirstName());
        assertEquals("Last", user.getLastName());
        assertTrue(user.getAdmin());
        assertEquals("secret", user.getPassword());
    }

    @Test
    void testAuthoritiesIsEmpty() {
        UserDetailsImpl user = new UserDetailsImpl(1L, "", "", "", true, "");
        Collection<?> authorities = user.getAuthorities();
        assertNotNull(authorities);
        assertTrue(authorities.isEmpty());
    }

    @Test
    void testAccountStatusMethods() {
        UserDetailsImpl user = new UserDetailsImpl(1L, "", "", "", true, "");
        assertTrue(user.isAccountNonExpired());
        assertTrue(user.isAccountNonLocked());
        assertTrue(user.isCredentialsNonExpired());
        assertTrue(user.isEnabled());
    }

    @Test
    void testEquals_sameId() {
        UserDetailsImpl user1 = new UserDetailsImpl(1L, "u1", "f1", "l1", true, "p1");
        UserDetailsImpl user2 = new UserDetailsImpl(1L, "u2", "f2", "l2", false, "p2");
        assertEquals(user1, user2);
    }

    @Test
    void testEquals_differentId() {
        UserDetailsImpl user1 = new UserDetailsImpl(1L, "", "", "", true, "");
        UserDetailsImpl user2 = new UserDetailsImpl(2L, "", "", "", true, "");
        assertNotEquals(user1, user2);
    }

    @Test
    void testEquals_nullAndDifferentClass() {
        UserDetailsImpl user = new UserDetailsImpl(1L, "", "", "", true, "");
        assertNotEquals(user, null);
        assertNotEquals(user, "not a user");
    }
}
