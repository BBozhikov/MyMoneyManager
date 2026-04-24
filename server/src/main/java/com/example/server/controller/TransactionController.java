package com.example.server.controller;

import com.example.server.dto.MessageResponse;
import com.example.server.dto.statistics.CategoryStatisticsResponse;
import com.example.server.dto.transaction.CreateTransactionRequest;
import com.example.server.dto.transaction.TransactionResponse;
import com.example.server.dto.transaction.UpdateTransactionRequest;
import com.example.server.entity.User;
import com.example.server.enums.CategoryType;
import com.example.server.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @Valid @RequestBody CreateTransactionRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(transactionService.createTransaction(user, request));
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getTransactions(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Integer accountId,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) CategoryType type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String note) {
        return ResponseEntity.ok(transactionService.getTransactions(user, accountId, categoryId, type, startDate, endDate, note));
    }

    @GetMapping("/statistics")
    public ResponseEntity<List<CategoryStatisticsResponse>> getCategoryStatistics(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(transactionService.getCategoryStatistics(user, startDate, endDate));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> updateTransaction(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateTransactionRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(transactionService.updateTransaction(user, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteTransaction(
            @PathVariable Integer id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(transactionService.deleteTransaction(user, id));
    }
}
