package com.example.evaluationform.model;



import lombok.Data;

@Data
public class OllamaRawResponse {
    private String model;
    private String created_at;
    private String response; // this is the actual stringified JSON you want
    private boolean done;
    private String done_reason;
}

