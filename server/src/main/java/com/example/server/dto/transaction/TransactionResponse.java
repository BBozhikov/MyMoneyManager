package com.example.server.dto.transaction;

import com.example.server.entity.Transaction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {

    private Integer id;
    private Integer accountId;
    private String accountName;
    private Integer categoryId;
    private String categoryName;
    private double amount;
    private LocalDate createdAt;
    private String note;

    public static TransactionResponse fromEntity(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .accountId(transaction.getAccount().getId())
                .accountName(transaction.getAccount().getName())
                .categoryId(transaction.getCategory().getId())
                .categoryName(transaction.getCategory().getName())
                .amount(transaction.getAmount())
                .createdAt(transaction.getCreatedAt())
                .note(transaction.getNote())
                .build();
    }
}
