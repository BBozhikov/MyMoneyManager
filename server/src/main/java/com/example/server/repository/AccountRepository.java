package com.example.server.repository;

import com.example.server.entity.Account;
import com.example.server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Integer> {

    boolean existsByUserAndName(User user, String name);
}
