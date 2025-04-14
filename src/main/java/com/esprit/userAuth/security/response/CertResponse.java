package com.esprit.userAuth.security.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertResponse {

    private String fileName;
    private String downloadURL;
    private String fileType;
    private long fileSize;


}
