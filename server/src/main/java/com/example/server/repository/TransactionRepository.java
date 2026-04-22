package com.example.server.repository;

import com.example.server.entity.Transaction;
import com.example.server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Integer>, JpaSpecificationExecutor<Transaction> {

    boolean existsByCategoryId(Integer categoryId);

    void deleteByAccountId(Integer accountId);

    Optional<Transaction> findByIdAndUser(Integer id, User user);
}
