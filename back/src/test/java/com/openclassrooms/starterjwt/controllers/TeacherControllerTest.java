package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TeacherControllerTest {

    private TeacherService teacherService;
    private TeacherMapper teacherMapper;
    private TeacherController teacherController;

    @BeforeEach
    void setUp() {
        teacherService = mock(TeacherService.class);
        teacherMapper = mock(TeacherMapper.class);
        teacherController = new TeacherController(teacherService, teacherMapper);
    }

    @Test
    void testFindById_validId_shouldReturnTeacher() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setFirstName("John");
        teacher.setLastName("Doe");

        TeacherDto teacherDto = new TeacherDto();
        teacherDto.setId(1L);
        teacherDto.setFirstName("John");
        teacherDto.setLastName("Doe");

        when(teacherService.findById(1L)).thenReturn(teacher);
        when(teacherMapper.toDto(teacher)).thenReturn(teacherDto);

        ResponseEntity<?> response = teacherController.findById("1");

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(teacherDto, response.getBody());
    }

    @Test
    void testFindById_invalidId_shouldReturnBadRequest() {
        ResponseEntity<?> response = teacherController.findById("abc");

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void testFindById_notFound_shouldReturnNotFound() {
        when(teacherService.findById(99L)).thenReturn(null);

        ResponseEntity<?> response = teacherController.findById("99");

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testFindAll_shouldReturnListOfTeachers() {
        Teacher teacher1 = new Teacher();
        teacher1.setId(1L);
        teacher1.setFirstName("John");

        Teacher teacher2 = new Teacher();
        teacher2.setId(2L);
        teacher2.setFirstName("Jane");

        List<Teacher> teachers = Arrays.asList(teacher1, teacher2);

        TeacherDto dto1 = new TeacherDto();
        dto1.setId(1L);
        dto1.setFirstName("John");

        TeacherDto dto2 = new TeacherDto();
        dto2.setId(2L);
        dto2.setFirstName("Jane");

        List<TeacherDto> dtoList = Arrays.asList(dto1, dto2);

        when(teacherService.findAll()).thenReturn(teachers);
        when(teacherMapper.toDto(teachers)).thenReturn(dtoList);

        ResponseEntity<?> response = teacherController.findAll();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(dtoList, response.getBody());
    }
}
