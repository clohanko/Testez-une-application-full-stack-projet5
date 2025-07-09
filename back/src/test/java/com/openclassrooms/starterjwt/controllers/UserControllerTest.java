package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserControllerTest {

    private UserService userService;
    private UserMapper userMapper;
    private UserController userController;

    @BeforeEach
    void setUp() {
        userService = mock(UserService.class);
        userMapper = mock(UserMapper.class);
        userController = new UserController(userService, userMapper);
    }

    @Test
    void testFindById_validId_shouldReturnUser() {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        UserDto userDto = new UserDto();
        userDto.setId(1L);
        userDto.setEmail("test@example.com");

        when(userService.findById(1L)).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(userDto);

        ResponseEntity<?> response = userController.findById("1");

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(userDto, response.getBody());
    }

    @Test
    void testFindById_invalidId_shouldReturnBadRequest() {
        ResponseEntity<?> response = userController.findById("abc");
        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void testFindById_userNotFound_shouldReturnNotFound() {
        when(userService.findById(99L)).thenReturn(null);
        ResponseEntity<?> response = userController.findById("99");
        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testSave_validUserAndAuthorized_shouldDeleteAndReturnOk() {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        UserDetails mockDetails = mock(UserDetails.class);
        when(mockDetails.getUsername()).thenReturn("test@example.com");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockDetails, null)
        );

        when(userService.findById(1L)).thenReturn(user);

        ResponseEntity<?> response = userController.save("1");

        assertEquals(200, response.getStatusCodeValue());
        verify(userService).delete(1L);
    }

    @Test
    void testSave_invalidId_shouldReturnBadRequest() {
        ResponseEntity<?> response = userController.save("abc");
        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void testSave_userNotFound_shouldReturnNotFound() {
        when(userService.findById(99L)).thenReturn(null);
        ResponseEntity<?> response = userController.save("99");
        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testSave_unauthorized_shouldReturnUnauthorized() {
        User user = new User();
        user.setId(1L);
        user.setEmail("user@example.com");

        UserDetails mockDetails = mock(UserDetails.class);
        when(mockDetails.getUsername()).thenReturn("other@example.com");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockDetails, null)
        );

        when(userService.findById(1L)).thenReturn(user);

        ResponseEntity<?> response = userController.save("1");

        assertEquals(401, response.getStatusCodeValue());
        verify(userService, never()).delete(anyLong());
    }
}
