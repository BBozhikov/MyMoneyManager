package com.example.server.repository;

import com.example.server.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TransactionRepository extends JpaRepository<Transaction, Integer>, JpaSpecificationExecutor<Transaction> {

    boolean existsByCategoryId(Integer categoryId);

    void deleteByAccountId(Integer accountId);
}
