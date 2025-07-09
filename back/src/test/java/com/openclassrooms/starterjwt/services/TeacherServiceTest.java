package com.openclassrooms.starterjwt.service;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class TeacherServiceTest {

    private final TeacherRepository teacherRepository = mock(TeacherRepository.class);
    private final TeacherService teacherService = new TeacherService(teacherRepository);

    @Test
    void shouldReturnAllTeachers() {
        // Given
        Teacher t1 = new Teacher().setId(1L).setLastName("Durand");
        Teacher t2 = new Teacher().setId(2L).setLastName("Martin");
        when(teacherRepository.findAll()).thenReturn(List.of(t1, t2));

        // When
        List<Teacher> result = teacherService.findAll();

        // Then
        assertThat(result).hasSize(2).containsExactly(t1, t2);
        verify(teacherRepository).findAll();
    }
}
