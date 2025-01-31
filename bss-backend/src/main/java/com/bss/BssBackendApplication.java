package com.bss;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BssBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BssBackendApplication.class, args);
	}


}
