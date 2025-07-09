package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SessionServiceTest {

    private SessionRepository sessionRepository;
    private UserRepository userRepository;
    private SessionService sessionService;

    @BeforeEach
    void setUp() {
        sessionRepository = mock(SessionRepository.class);
        userRepository = mock(UserRepository.class);
        sessionService = new SessionService(sessionRepository, userRepository);
    }

    @Test
    void create_shouldSaveSession() {
        Session session = new Session();
        when(sessionRepository.save(session)).thenReturn(session);

        Session result = sessionService.create(session);

        assertEquals(session, result);
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void delete_shouldCallDeleteById() {
        sessionService.delete(1L);
        verify(sessionRepository, times(1)).deleteById(1L);
    }

    @Test
    void findAll_shouldReturnSessions() {
        List<Session> sessions = Arrays.asList(new Session(), new Session());
        when(sessionRepository.findAll()).thenReturn(sessions);

        List<Session> result = sessionService.findAll();

        assertEquals(2, result.size());
        verify(sessionRepository).findAll();
    }

    @Test
    void getById_shouldReturnSession_whenExists() {
        Session session = new Session();
        session.setId(1L);
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        Session result = sessionService.getById(1L);

        assertEquals(1L, result.getId());
    }

    @Test
    void getById_shouldReturnNull_whenNotFound() {
        when(sessionRepository.findById(999L)).thenReturn(Optional.empty());

        Session result = sessionService.getById(999L);

        assertNull(result);
    }

    @Test
    void update_shouldSetIdAndSave() {
        Session session = new Session();
        when(sessionRepository.save(session)).thenReturn(session);

        Session result = sessionService.update(10L, session);

        assertEquals(session, result);
        verify(sessionRepository).save(session);
        assertEquals(10L, session.getId());
    }

    @Test
    void participate_shouldAddUserAndSave() {
        User user = new User();
        user.setId(2L);
        Session session = new Session();
        session.setId(1L);
        session.setUsers(new ArrayList<>());

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(2L)).thenReturn(Optional.of(user));
        when(sessionRepository.save(session)).thenReturn(session);

        sessionService.participate(1L, 2L);

        assertTrue(session.getUsers().contains(user));
        verify(sessionRepository).save(session);
    }

    @Test
    void participate_shouldThrowNotFound_whenSessionOrUserMissing() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());
        when(userRepository.findById(2L)).thenReturn(Optional.of(new User()));

        assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 2L));

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(new Session()));
        when(userRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 2L));
    }

    @Test
    void participate_shouldThrowBadRequest_whenUserAlreadyParticipates() {
        User user = new User();
        user.setId(2L);

        Session session = new Session();
        session.setId(1L);
        session.setUsers(new ArrayList<>(List.of(user)));

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(2L)).thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class, () -> sessionService.participate(1L, 2L));
    }

    @Test
    void noLongerParticipate_shouldRemoveUserAndSave() {
        User user = new User();
        user.setId(2L);
        Session session = new Session();
        session.setId(1L);
        session.setUsers(new ArrayList<>(List.of(user)));

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(2L)).thenReturn(Optional.of(user));
        when(sessionRepository.save(any(Session.class))).thenReturn(session);

        sessionService.noLongerParticipate(1L, 2L);

        assertFalse(session.getUsers().contains(user));
        verify(sessionRepository).save(session);
    }

    @Test
    void noLongerParticipate_shouldThrowNotFound_whenUserNotFound() {
        Session session = new Session();
        session.setId(1L);

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(1L, 99L));
    }

    @Test
    void noLongerParticipate_shouldThrowNotFound_whenSessionNotFound() {
        when(sessionRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(999L, 1L));
    }

    @Test
    void noLongerParticipate_shouldThrowNotFound_whenUserIsNull() {
        Session session = new Session();
        session.setId(1L);
        session.setUsers(List.of());

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(999L)).thenReturn(Optional.empty()); // <- simulate null user

        assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(1L, 999L));
    }


    @Test
    void noLongerParticipate_shouldThrowBadRequest_whenUserIsNotInSession() {
        // given
        User existingUser = new User();
        existingUser.setId(42L); // user présent

        Session session = new Session();
        session.setId(1L);
        session.setUsers(new ArrayList<>(List.of(existingUser)));

        // simulate session exists
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        // simulate user exists, but not in session
        User otherUser = new User();
        otherUser.setId(99L);
        when(userRepository.findById(99L)).thenReturn(Optional.of(otherUser));

        // when/then
        assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(1L, 99L));
    }

}
