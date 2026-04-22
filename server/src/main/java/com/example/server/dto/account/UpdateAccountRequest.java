package com.example.server.dto.account;

import com.example.server.enums.AccountIcon;
import com.example.server.enums.Color;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAccountRequest {

    @Size(max = 80)
    private String name;

    @NotNull
    private AccountIcon icon;

    @NotNull
    private Color color;

    private double currentBalance;
}
