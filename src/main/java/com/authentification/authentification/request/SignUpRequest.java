package com.authentification.authentification.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignUpRequest {


        private String email;
        private String password;
        private String name;
        private String employeeName;
        private String employeeSurname;
        private String employeeDateOfBirth;
        private String employeeNumber;



}
