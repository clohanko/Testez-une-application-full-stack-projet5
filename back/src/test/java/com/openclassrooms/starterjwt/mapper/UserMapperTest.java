package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class UserMapperTest {

    private final UserMapper mapper = Mappers.getMapper(UserMapper.class);

    @Test
    void testToDto() {
        User user = new User();
        user.setId(1L);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("john.doe@example.com");
        user.setPassword("secure123");
        user.setAdmin(true);

        UserDto dto = mapper.toDto(user);

        assertNotNull(dto);
        assertEquals(1L, dto.getId());
        assertEquals("John", dto.getFirstName());
        assertEquals("Doe", dto.getLastName());
        assertEquals("john.doe@example.com", dto.getEmail());
        assertTrue(dto.isAdmin());
    }

    @Test
    void testToEntity() {
        UserDto dto = new UserDto();
        dto.setId(2L);
        dto.setFirstName("Anna");
        dto.setLastName("Smith");
        dto.setEmail("anna.smith@example.com");
        dto.setPassword("mypassword");
        dto.setAdmin(false);

        User user = mapper.toEntity(dto);

        assertNotNull(user);
        assertEquals(2L, user.getId());
        assertEquals("Anna", user.getFirstName());
        assertEquals("Smith", user.getLastName());
        assertEquals("anna.smith@example.com", user.getEmail());
        assertEquals("mypassword", user.getPassword());
        assertFalse(user.isAdmin());
    }

    @Test
    void testToDtoList() {
        User user1 = new User();
        user1.setId(1L);
        user1.setFirstName("John");
        user1.setLastName("Doe");
        user1.setEmail("john.doe@example.com");
        user1.setPassword("pwd");
        user1.setAdmin(false);

        User user2 = new User();
        user2.setId(2L);
        user2.setFirstName("Alice");
        user2.setLastName("Smith");
        user2.setEmail("alice.smith@example.com");
        user2.setPassword("pwd");
        user2.setAdmin(true);

        List<UserDto> dtos = mapper.toDto(List.of(user1, user2));

        assertEquals(2, dtos.size());
        assertEquals("John", dtos.get(0).getFirstName());
        assertEquals("Alice", dtos.get(1).getFirstName());
    }

    @Test
    void testToEntityList() {
        UserDto dto1 = new UserDto();
        dto1.setId(1L);
        dto1.setFirstName("Max");
        dto1.setLastName("Payne");
        dto1.setEmail("max.payne@example.com");
        dto1.setPassword("pwd");
        dto1.setAdmin(false);

        UserDto dto2 = new UserDto();
        dto2.setId(2L);
        dto2.setFirstName("Emma");
        dto2.setLastName("Stone");
        dto2.setEmail("emma.stone@example.com");
        dto2.setPassword("pwd");
        dto2.setAdmin(true);

        List<User> users = mapper.toEntity(List.of(dto1, dto2));

        assertEquals(2, users.size());
        assertEquals("Max", users.get(0).getFirstName());
        assertEquals("Emma", users.get(1).getFirstName());
    }

    @Test
    void testNullAndEmptyList() {
        assertNull(mapper.toDto((User) null));
        assertNull(mapper.toEntity((UserDto) null));
        assertNull(mapper.toDto((List<User>) null));
        assertNull(mapper.toEntity((List<UserDto>) null));
    }
}
