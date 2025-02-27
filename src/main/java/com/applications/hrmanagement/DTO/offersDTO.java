package com.applications.hrmanagement.DTO;

import com.applications.hrmanagement.Entities.ContractType;
import com.applications.hrmanagement.Entities.JobLocation;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
@Getter
@Setter
public class offersDTO {


        private String title;

        private ContractType contractType; // Enum


        private LocalDate createdAt;
    }

