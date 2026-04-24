package com.example.server.entity;

import com.example.server.enums.AccountIcon;
import com.example.server.enums.Color;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "accounts", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "name"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 80)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountIcon icon;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Color color;

    @Column(name = "current_balance", nullable = false)
    private double currentBalance;

    @Column(name = "is_main", nullable = false)
    private boolean isMain = false;
}
