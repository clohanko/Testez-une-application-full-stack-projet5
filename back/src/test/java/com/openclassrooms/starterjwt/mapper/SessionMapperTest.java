package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@SpringBootTest
class SessionMapperTest {

    @Autowired
    private SessionMapper mapper;

    @MockBean
    private TeacherService teacherService;

    @MockBean
    private UserService userService;

    @Test
    void shouldMapToDto() {
        Session session = new Session();
        session.setId(1L);
        session.setName("Cours de yoga");
        session.setDescription("Détente");
        session.setDate(new Date());
        Teacher teacher = new Teacher().setId(2L);
        session.setTeacher(teacher);
        session.setUsers(List.of(new User().setId(100L)));

        SessionDto dto = mapper.toDto(session);

        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getName()).isEqualTo("Cours de yoga");
        assertThat(dto.getTeacher_id()).isEqualTo(2L);
        assertThat(dto.getUsers()).containsExactly(100L);
    }

    @Test
    void shouldMapToEntity() {
        SessionDto dto = new SessionDto();
        dto.setId(1L);
        dto.setName("Pilates");
        dto.setDescription("Renforcement");
        dto.setDate(new Date());
        dto.setTeacher_id(3L);
        dto.setUsers(List.of(200L));

        when(teacherService.findById(3L)).thenReturn(new Teacher().setId(3L));
        when(userService.findById(200L)).thenReturn(new User().setId(200L));

        Session session = mapper.toEntity(dto);

        assertThat(session).isNotNull();
        assertThat(session.getId()).isEqualTo(1L);
        assertThat(session.getName()).isEqualTo("Pilates");
        assertThat(session.getTeacher()).isNotNull();
        assertThat(session.getTeacher().getId()).isEqualTo(3L);
        assertThat(session.getUsers()).hasSize(1);
        assertThat(session.getUsers().get(0).getId()).isEqualTo(200L);
    }

    @Test
    void shouldMapToEntity_withNullTeacherId() {
        SessionDto dto = new SessionDto();
        dto.setName("Sans prof");
        dto.setDescription("Test null");
        dto.setDate(new Date());
        dto.setTeacher_id(null);
        dto.setUsers(null);

        Session session = mapper.toEntity(dto);

        assertThat(session).isNotNull();
        assertThat(session.getTeacher()).isNull();
        assertThat(session.getUsers()).isEmpty();
    }

    @Test
    void shouldMapSessionListToDtoList() {
        Session session = new Session();
        session.setId(1L);
        session.setName("Yoga");
        session.setDescription("Relax");
        session.setDate(new Date());
        Teacher teacher = new Teacher().setId(10L);
        session.setTeacher(teacher);
        session.setUsers(List.of(new User().setId(100L)));

        List<SessionDto> dtos = mapper.toDto(List.of(session));

        assertThat(dtos).isNotNull();
        assertThat(dtos).hasSize(1);
        assertThat(dtos.get(0).getId()).isEqualTo(1L);
        assertThat(dtos.get(0).getTeacher_id()).isEqualTo(10L);
        assertThat(dtos.get(0).getUsers()).containsExactly(100L);
    }

    @Test
    void shouldMapSessionDtoListToEntityList() {
        SessionDto dto = new SessionDto();
        dto.setId(1L);
        dto.setName("Pilates");
        dto.setDescription("Fitness");
        dto.setDate(new Date());
        dto.setTeacher_id(5L);
        dto.setUsers(List.of(200L));

        // mocks
        when(teacherService.findById(5L)).thenReturn(new Teacher().setId(5L));
        when(userService.findById(200L)).thenReturn(new User().setId(200L));

        List<Session> sessions = mapper.toEntity(List.of(dto));

        assertThat(sessions).isNotNull();
        assertThat(sessions).hasSize(1);
        assertThat(sessions.get(0).getId()).isEqualTo(1L);
        assertThat(sessions.get(0).getTeacher().getId()).isEqualTo(5L);
        assertThat(sessions.get(0).getUsers()).hasSize(1);
        assertThat(sessions.get(0).getUsers().get(0).getId()).isEqualTo(200L);
    }

    @Test
    void toDto_shouldHandleNullTeacherAndNullTeacherId() {
        Session session = new Session();
        session.setId(99L);
        session.setName("Cours sans prof");
        session.setDescription("Test null");
        session.setDate(new Date());
        session.setUsers(List.of(new User().setId(123L)));

        // Cas 1 : session.getTeacher() == null
        SessionDto dto = mapper.toDto(session);
        assertThat(dto.getTeacher_id()).isNull();

        // Cas 2 : session.getTeacher().getId() == null
        session.setTeacher(new Teacher()); // id null
        dto = mapper.toDto(session);
        assertThat(dto.getTeacher_id()).isNull();
    }

    @Test
    void toDto_shouldHandleNullTeacherAndNullUsers() {
        Session session = new Session();
        session.setId(10L);
        session.setName("Test");
        session.setDescription("Desc");
        session.setDate(new Date());
        session.setTeacher(null);
        session.setUsers(null); // pour lambda$toDto$1

        SessionDto dto = mapper.toDto(session);

        assertThat(dto).isNotNull();
        assertThat(dto.getTeacher_id()).isNull();
        assertThat(dto.getUsers()).isEmpty();
    }

    @Test
    void toEntity_shouldHandleNullTeacherAndNullUsers() {
        SessionDto dto = new SessionDto();
        dto.setId(10L);
        dto.setName("Test");
        dto.setDescription("Desc");
        dto.setDate(new Date());
        dto.setTeacher_id(null);
        dto.setUsers(null); // pour lambda$toEntity$0

        Session session = mapper.toEntity(dto);

        assertThat(session).isNotNull();
        assertThat(session.getTeacher()).isNull();
        assertThat(session.getUsers()).isEmpty();
    }

    @Test
    void toDto_shouldHandleEmptyList() {
        List<Session> sessions = Collections.emptyList();

        List<SessionDto> dtos = mapper.toDto(sessions);

        assertThat(dtos).isEmpty();
    }




}
