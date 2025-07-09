package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TeacherMapperTest {

    private final TeacherMapper mapper = Mappers.getMapper(TeacherMapper.class);

    @Test
    void testToDto() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setLastName("Doe");
        teacher.setFirstName("John");

        TeacherDto dto = mapper.toDto(teacher);

        assertNotNull(dto);
        assertEquals(1L, dto.getId());
        assertEquals("Doe", dto.getLastName());
        assertEquals("John", dto.getFirstName());
    }

    @Test
    void testToDto_shouldReturnNull_whenInputIsNull() {
        assertNull(mapper.toDto((Teacher) null));
    }

    @Test
    void testToEntity() {
        TeacherDto dto = new TeacherDto();
        dto.setId(2L);
        dto.setLastName("Smith");
        dto.setFirstName("Anna");

        Teacher teacher = mapper.toEntity(dto);

        assertNotNull(teacher);
        assertEquals(2L, teacher.getId());
        assertEquals("Smith", teacher.getLastName());
        assertEquals("Anna", teacher.getFirstName());
    }

    @Test
    void testToEntity_shouldReturnNull_whenInputIsNull() {
        assertNull(mapper.toEntity((TeacherDto) null));
    }

    @Test
    void testToDtoList() {
        Teacher teacher1 = new Teacher();
        teacher1.setId(1L);
        teacher1.setLastName("Doe");

        Teacher teacher2 = new Teacher();
        teacher2.setId(2L);
        teacher2.setLastName("Smith");

        List<TeacherDto> dtoList = mapper.toDto(List.of(teacher1, teacher2));

        assertEquals(2, dtoList.size());
        assertEquals(1L, dtoList.get(0).getId());
        assertEquals(2L, dtoList.get(1).getId());
    }

    @Test
    void testToDtoList_shouldReturnNull_whenInputIsNull() {
        assertNull(mapper.toDto((List<Teacher>) null));
    }

    @Test
    void testToEntityList() {
        TeacherDto dto1 = new TeacherDto();
        dto1.setId(1L);
        dto1.setFirstName("John");

        TeacherDto dto2 = new TeacherDto();
        dto2.setId(2L);
        dto2.setFirstName("Anna");

        List<Teacher> entityList = mapper.toEntity(List.of(dto1, dto2));

        assertEquals(2, entityList.size());
        assertEquals("John", entityList.get(0).getFirstName());
        assertEquals("Anna", entityList.get(1).getFirstName());
    }

    @Test
    void testToEntityList_shouldReturnNull_whenInputIsNull() {
        assertNull(mapper.toEntity((List<TeacherDto>) null));
    }
}
