package com.example.server.dto.transaction;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTransactionRequest {

    @NotNull
    private Integer categoryId;

    private double amount;

    @Size(max = 255)
    private String note;
}
