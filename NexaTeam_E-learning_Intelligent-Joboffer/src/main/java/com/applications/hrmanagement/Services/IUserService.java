package com.applications.hrmanagement.Services;

import com.applications.hrmanagement.DTO.userDTO;
import com.applications.hrmanagement.Entities.User;

public interface IUserService {
    User getUserById(String userId);
    userDTO convertToDTO(User user);
} 