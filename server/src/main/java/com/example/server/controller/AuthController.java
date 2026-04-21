package com.example.server.controller;

import com.example.server.dto.AuthResponse;
import com.example.server.dto.ForgotPasswordRequest;
import com.example.server.dto.LoginRequest;
import com.example.server.dto.MessageResponse;
import com.example.server.dto.RefreshTokenRequest;
import com.example.server.dto.RegisterRequest;
import com.example.server.dto.ResetPasswordRequest;
import com.example.server.entity.User;
import com.example.server.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @GetMapping("/verify")
    public ResponseEntity<MessageResponse> verifyEmail(@RequestParam String token) {
        return ResponseEntity.ok(authService.verifyEmail(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(
            @Valid @RequestBody RefreshTokenRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(authService.logout(request.getRefreshToken(), user.getId()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request.getRefreshToken()));
    }

    @GetMapping("/validate-token")
    public ResponseEntity<Void> validate() {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok(authService.requestPasswordReset(request.getEmail()));
    }

    @GetMapping("/redirect-reset")
    public ResponseEntity<Void> redirectReset(@RequestParam String token) {
        String deepLink = "mymoneymanager2://(auth)/reset-password?token=" + token;
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(deepLink))
                .build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request));
    }

}
