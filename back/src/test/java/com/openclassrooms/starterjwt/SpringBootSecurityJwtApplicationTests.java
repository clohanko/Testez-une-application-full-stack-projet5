package com.openclassrooms.starterjwt;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

@SpringBootTest
public class SpringBootSecurityJwtApplicationTests {

	@Test
	public void contextLoads() {
	}

	@Test
	public void mainMethodShouldRunWithoutExceptions() {
		assertDoesNotThrow(() -> SpringBootSecurityJwtApplication.main(new String[] {}));
	}
}
