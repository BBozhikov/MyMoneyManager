package com.example.server.dto.account;

import com.example.server.entity.Account;
import com.example.server.enums.AccountIcon;
import com.example.server.enums.Color;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse {

    private Integer id;
    private String name;
    private AccountIcon icon;
    private Color color;
    private double currentBalance;
    private boolean isMain;

    public static AccountResponse fromEntity(Account account) {
        return AccountResponse.builder()
                .id(account.getId())
                .name(account.getName())
                .icon(account.getIcon())
                .color(account.getColor())
                .currentBalance(account.getCurrentBalance())
                .isMain(account.isMain())
                .build();
    }
}
