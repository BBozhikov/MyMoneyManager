package com.example.server.controller;

import com.example.server.dto.category.CategoryResponse;
import com.example.server.dto.category.CreateCategoryRequest;
import com.example.server.dto.MessageResponse;
import com.example.server.dto.category.UpdateCategoryRequest;
import com.example.server.entity.User;
import com.example.server.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CreateCategoryRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(categoryService.createCategory(user, request));
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getUserCategories(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(categoryService.getUserCategories(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateCategoryRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(categoryService.updateCategory(user, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteCategory(
            @PathVariable Integer id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(categoryService.deleteCategory(user, id));
    }
}
