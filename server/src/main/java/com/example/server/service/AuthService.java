package com.example.server.service;

import com.example.server.dto.AuthResponse;
import com.example.server.dto.LoginRequest;
import com.example.server.dto.MessageResponse;
import com.example.server.dto.RegisterRequest;
import com.example.server.entity.RefreshToken;
import com.example.server.entity.User;
import com.example.server.entity.VerificationToken;
import com.example.server.enums.Currency;
import com.example.server.exception.InvalidRefreshTokenException;
import com.example.server.repository.UserRepository;
import com.example.server.repository.VerificationTokenRepository;
import com.example.server.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final RefreshTokenService refreshTokenService;

    @Value("${app.verification-token-expiry-hours}")
    private int verificationTokenExpiryHours;

    public MessageResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .currency(Currency.EUR)
                .isActive(false)
                .build();

        userRepository.save(user);

        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = VerificationToken.builder()
                .token(token)
                .user(user)
                .expiresAt(LocalDateTime.now().plusHours(verificationTokenExpiryHours))
                .build();

        verificationTokenRepository.save(verificationToken);

        emailService.sendVerificationEmail(user.getEmail(), token);

        return new MessageResponse("Registration successful. Please check your email to verify your account.");
    }

    public MessageResponse verifyEmail(String token) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid verification token"));

        if (verificationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Verification token has expired");
        }

        User user = verificationToken.getUser();
        user.setActive(true);
        userRepository.save(user);

        verificationTokenRepository.delete(verificationToken);

        return new MessageResponse("Email verified successfully. You can now log in.");
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new DisabledException("Account is not verified. Please check your email.");
        }

        String accessToken = jwtService.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .build();
    }

    public AuthResponse refreshToken(String refreshTokenString) {
        RefreshToken oldRefreshToken = refreshTokenService.verifyRefreshToken(refreshTokenString);
        User user = oldRefreshToken.getUser();

        RefreshToken newRefreshToken = refreshTokenService.rotateRefreshToken(oldRefreshToken);
        String accessToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(newRefreshToken.getToken())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .build();
    }

    public MessageResponse logout(String refreshTokenString, UUID userId) {
        RefreshToken refreshToken = refreshTokenService.verifyRefreshToken(refreshTokenString);

        if (!refreshToken.getUser().getId().equals(userId)) {
            throw new InvalidRefreshTokenException("Refresh token does not belong to this user");
        }

        refreshTokenService.revokeRefreshToken(refreshTokenString);
        return new MessageResponse("Logged out successfully.");
    }
}
