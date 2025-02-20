package com.authentification.authentification.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
@Data
@AllArgsConstructor
@NoArgsConstructor

public class LoginRequest {


    private String email;
    private String password;
}
