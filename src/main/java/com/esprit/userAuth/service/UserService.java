package com.esprit.userAuth.service;

import com.esprit.userAuth.dtos.UserDTO;
import com.esprit.userAuth.dtos.UserUpdateDTO;
import com.esprit.userAuth.entity.Role;
import com.esprit.userAuth.entity.User;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;

import java.util.List;
import java.util.Optional;

public interface UserService {
    void updateUserRole(Long userId, String roleName);

    List<User> getAllUsers();

    UserDTO getUserById(Long id);

    User findByUsername(String username);

    void updateAccountLockStatus(Long userId, boolean lock);

    List<Role> getAllRoles();

    void updateAccountExpiryStatus(Long userId, boolean expire);

    void updateAccountEnabledStatus(Long userId, boolean enabled);

    void updateCredentialsExpiryStatus(Long userId, boolean expire);

    void updatePassword(Long userId, String password);

    void generatePasswordResetToken(String email);

    void resetPassword(String token, String newPassword);

    Optional<User> findByEmail(String email);

    User registerUser(User user);

    GoogleAuthenticatorKey generate2FASecret(Long userId);

    boolean validate2FACode(Long userId, int code);

    void enable2FA(Long userId);

    void disable2FA(Long userId);

    boolean validateCurrentPassword(Long userId, String currentPassword);

    User createAdminUser(String username, String email, String password, String firstName, String lastName);

    User createEmployeeUser(String username, String email, String firstName, String lastName, 
                           Long companyId );
                           //String position, String department

    Optional<User> findById(Long id);
    
    /**
     * Update the authenticated user's profile information
     * @param userId ID of the user to update
     * @param updateDTO DTO containing the fields to update
     * @return Updated user entity
     */
    User updateUserProfile(Long userId, UserUpdateDTO updateDTO);
}
