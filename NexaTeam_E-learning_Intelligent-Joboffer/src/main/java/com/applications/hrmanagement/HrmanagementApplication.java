package com.applications.hrmanagement;

import com.applications.hrmanagement.Services.EmailService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class HrmanagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(HrmanagementApplication.class, args);
	}



}
