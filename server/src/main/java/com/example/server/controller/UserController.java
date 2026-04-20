package com.example.server.controller;

import com.example.server.dto.MessageResponse;
import com.example.server.dto.RefreshTokenRequest;
import com.example.server.entity.User;
import com.example.server.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;

    @GetMapping("/validate")
    public ResponseEntity<Void> validate() {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(
            @Valid @RequestBody RefreshTokenRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(authService.logout(request.getRefreshToken(), user.getId()));
    }
}
