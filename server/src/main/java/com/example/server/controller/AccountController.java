package com.example.server.controller;

import com.example.server.dto.account.AccountResponse;
import com.example.server.dto.account.CreateAccountRequest;
import com.example.server.entity.User;
import com.example.server.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(
            @Valid @RequestBody CreateAccountRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(accountService.createAccount(user, request));
    }

    @GetMapping
    public ResponseEntity<List<AccountResponse>> getUserAccounts(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(accountService.getUserAccounts(user));
    }
}
