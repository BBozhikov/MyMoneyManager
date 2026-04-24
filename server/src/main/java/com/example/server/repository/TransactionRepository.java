package com.example.server.repository;

import com.example.server.dto.statistics.CategoryStatisticsResponse;
import com.example.server.entity.Transaction;
import com.example.server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Integer>, JpaSpecificationExecutor<Transaction> {

    boolean existsByCategoryId(Integer categoryId);

    void deleteByAccountId(Integer accountId);

    Optional<Transaction> findByIdAndUser(Integer id, User user);

    @Query("SELECT new com.example.server.dto.statistics.CategoryStatisticsResponse(" +
           "c.name, c.type, c.icon, c.color, SUM(t.amount)) " +
           "FROM Transaction t JOIN t.category c " +
           "WHERE t.user = :user " +
           "AND (:startDate IS NULL OR t.createdAt >= :startDate) " +
           "AND (:endDate IS NULL OR t.createdAt <= :endDate) " +
           "GROUP BY c.id, c.name, c.type, c.icon, c.color")
    List<CategoryStatisticsResponse> getCategoryStatistics(
            @Param("user") User user,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}
