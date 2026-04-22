package com.example.server.repository;

import com.example.server.entity.Account;
import com.example.server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Integer> {

    List<Account> findByUser(User user);

    boolean existsByUserAndName(User user, String name);
}
