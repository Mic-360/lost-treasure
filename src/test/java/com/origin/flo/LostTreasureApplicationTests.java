package com.origin.flo;

import static org.assertj.core.api.Assertions.assertThat;

import com.origin.flo.controller.AuthController;
import com.origin.flo.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class LostTreasureApplicationTests {

	@Autowired
	private AuthController authController;

	@Autowired
	private UserService userService;

	@Test
	void contextLoads() {
		// This test ensures that the application context loads successfully
	}

	@Test
	void authControllerLoads() {
		// This test ensures that the AuthController bean is created successfully
		assertThat(authController).isNotNull();
	}

	@Test
	void userServiceLoads() {
		// This test ensures that the UserService bean is created successfully
		assertThat(userService).isNotNull();
	}
}