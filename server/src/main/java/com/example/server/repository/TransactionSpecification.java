package com.example.server.repository;

import com.example.server.entity.Category;
import com.example.server.entity.Transaction;
import com.example.server.entity.User;
import com.example.server.enums.CategoryType;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class TransactionSpecification {

    public static Specification<Transaction> hasUser(User user) {
        return (root, query, cb) -> cb.equal(root.get("user"), user);
    }

    public static Specification<Transaction> hasAccount(Integer accountId) {
        return (root, query, cb) -> cb.equal(root.get("account").get("id"), accountId);
    }

    public static Specification<Transaction> hasCategory(Integer categoryId) {
        return (root, query, cb) -> cb.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<Transaction> hasCategoryType(CategoryType type) {
        return (root, query, cb) -> {
            Join<Transaction, Category> categoryJoin = root.join("category");
            return cb.equal(categoryJoin.get("type"), type);
        };
    }

    public static Specification<Transaction> createdBetween(LocalDate start, LocalDate end) {
        return (root, query, cb) -> cb.between(root.get("createdAt"), start, end);
    }

    public static Specification<Transaction> noteContains(String text) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("note")), "%" + text.toLowerCase() + "%");
    }
}
