package com.example.server.repository;

import com.example.server.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {

    boolean existsByCategoryId(Integer categoryId);
}
