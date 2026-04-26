package com.example.server.service;

import com.example.server.dto.user.ChangePasswordRequest;
import com.example.server.dto.MessageResponse;
import com.example.server.entity.User;
import com.example.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public MessageResponse changePassword(User user, ChangePasswordRequest request) {
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Текущата парола е грешна");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return new MessageResponse("Паролата е променена успешно.");
    }

    public MessageResponse deactivateAccount(User user) {
        user.setDeactivated(true);
        userRepository.save(user);

        return new MessageResponse("Акаунтът е деактивиран успешно.");
    }
}
