package com.esprit.userAuth.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {
        Map<String, Object> errorDetails = new HashMap<>();
        
        Object status = request.getAttribute("jakarta.servlet.error.status_code");
        Object exception = request.getAttribute("jakarta.servlet.error.exception");
        Object message = request.getAttribute("jakarta.servlet.error.message");
        Object path = request.getAttribute("jakarta.servlet.error.request_uri");
        
        errorDetails.put("status", status != null ? status : HttpStatus.INTERNAL_SERVER_ERROR.value());
        errorDetails.put("error", "An error occurred");
        errorDetails.put("message", message != null ? message : (exception != null ? exception.toString() : "Unknown error"));
        errorDetails.put("path", path != null ? path : request.getRequestURI());
        
        HttpStatus httpStatus = status != null ? 
                HttpStatus.valueOf(Integer.parseInt(status.toString())) : 
                HttpStatus.INTERNAL_SERVER_ERROR;
        
        return new ResponseEntity<>(errorDetails, httpStatus);
    }
} 