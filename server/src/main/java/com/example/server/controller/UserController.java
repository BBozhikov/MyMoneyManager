package com.example.server.controller;

import com.example.server.dto.ChangePasswordRequest;
import com.example.server.dto.MessageResponse;
import com.example.server.entity.User;
import com.example.server.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/change-password")
    public ResponseEntity<MessageResponse> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.changePassword(user, request));
    }

    @PostMapping("/deactivate")
    public ResponseEntity<MessageResponse> deactivateAccount(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.deactivateAccount(user));
    }
}
