package com.example.server.repository;

import com.example.server.entity.Category;
import com.example.server.entity.User;
import com.example.server.enums.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    List<Category> findByUserAndIsActiveTrue(User user);

    Optional<Category> findByIdAndUser(Integer id, User user);

    boolean existsByUserAndNameAndTypeAndIsActiveTrue(User user, String name, CategoryType type);
}
