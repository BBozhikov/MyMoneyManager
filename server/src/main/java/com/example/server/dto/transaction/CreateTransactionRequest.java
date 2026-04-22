package com.example.server.dto.transaction;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTransactionRequest {

    @NotNull
    private Integer accountId;

    @NotNull
    private Integer categoryId;

    private double amount;

    @NotNull
    private LocalDate createdAt;

    @Size(max = 255)
    private String note;
}
