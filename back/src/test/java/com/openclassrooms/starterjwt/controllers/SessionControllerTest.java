package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import java.util.List;


import javax.transaction.Transactional;
import java.util.Date;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Transactional
@TestPropertySource(locations = "classpath:application-test.properties")
class SessionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SessionService sessionService;

    @MockBean
    private SessionMapper sessionMapper;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldReturnSessionById() throws Exception {
        Session session = new Session();
        session.setId(1L);
        session.setName("Yoga matinal");
        session.setDate(new Date());

        SessionDto dto = new SessionDto();
        dto.setId(1L);
        dto.setName("Yoga matinal");

        when(sessionService.getById(1L)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(dto);

        mockMvc.perform(get("/api/session/1")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Yoga matinal"));
    }

    @Test
    void shouldReturn404WhenSessionNotFound() throws Exception {
        when(sessionService.getById(999L)).thenReturn(null);

        mockMvc.perform(get("/api/session/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldReturn400WhenIdIsInvalid() throws Exception {
        mockMvc.perform(get("/api/session/abc"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnAllSessions() throws Exception {
        // Données simulées
        Session session1 = new Session();
        session1.setId(1L);
        session1.setName("Yoga matin");
        session1.setDate(new Date());

        Session session2 = new Session();
        session2.setId(2L);
        session2.setName("Yoga soir");
        session2.setDate(new Date());

        List<Session> sessionList = List.of(session1, session2);

        SessionDto dto1 = new SessionDto();
        dto1.setId(1L);
        dto1.setName("Yoga matin");

        SessionDto dto2 = new SessionDto();
        dto2.setId(2L);
        dto2.setName("Yoga soir");

        List<SessionDto> dtoList = List.of(dto1, dto2);

        // Mocks
        when(sessionService.findAll()).thenReturn(sessionList);
        when(sessionMapper.toDto(sessionList)).thenReturn(dtoList);

        // Requête GET
        mockMvc.perform(get("/api/session")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Yoga matin"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].name").value("Yoga soir"));
    }

    @Test
    void shouldCreateSession() throws Exception {
        // DTO reçu
        SessionDto inputDto = new SessionDto();
        inputDto.setName("Yoga du soir");
        inputDto.setDate(new Date());
        inputDto.setTeacher_id(1L);
        inputDto.setDescription("Session de yoga relaxante");

        // Entité que le mapper produit
        Session session = new Session();
        session.setId(1L);
        session.setName("Yoga du soir");

        // DTO retourné après création
        SessionDto outputDto = new SessionDto();
        outputDto.setId(1L);
        outputDto.setName("Yoga du soir");

        // Mocks
        when(sessionMapper.toEntity(inputDto)).thenReturn(session);
        when(sessionService.create(session)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(outputDto);

        // Requête POST
        mockMvc.perform(
                        post("/api/session")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(inputDto))
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Yoga du soir"));
    }

    @Test
    void shouldUpdateSession() throws Exception {
        SessionDto inputDto = new SessionDto();
        inputDto.setName("Yoga modifié");
        inputDto.setDate(new Date());
        inputDto.setTeacher_id(1L);
        inputDto.setDescription("Modifié");

        Session session = new Session();
        session.setId(1L);
        session.setName("Yoga modifié");

        SessionDto outputDto = new SessionDto();
        outputDto.setId(1L);
        outputDto.setName("Yoga modifié");

        when(sessionMapper.toEntity(inputDto)).thenReturn(session);
        when(sessionService.update(1L, session)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(outputDto);

        mockMvc.perform(put("/api/session/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Yoga modifié"));
    }

    @Test
    void shouldDeleteSession() throws Exception {
        Session session = new Session();
        session.setId(1L);
        when(sessionService.getById(1L)).thenReturn(session);

        mockMvc.perform(delete("/api/session/1"))
                .andExpect(status().isOk());
    }

    @Test
    void shouldReturn404WhenDeletingNonexistentSession() throws Exception {
        when(sessionService.getById(999L)).thenReturn(null);

        mockMvc.perform(delete("/api/session/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldParticipateToSession() throws Exception {
        mockMvc.perform(post("/api/session/1/participate/2"))
                .andExpect(status().isOk());

        Mockito.verify(sessionService).participate(1L, 2L);
    }

    @Test
    void shouldCancelParticipationToSession() throws Exception {
        mockMvc.perform(delete("/api/session/1/participate/2"))
                .andExpect(status().isOk());

        Mockito.verify(sessionService).noLongerParticipate(1L, 2L);
    }


}
