package com.example.evaluationform.model;



import lombok.Data;

@Data
public class OllamaRawResponse {
    private String model;
    private String created_at;
    private String response;
    private boolean done;
    private String done_reason;
}

