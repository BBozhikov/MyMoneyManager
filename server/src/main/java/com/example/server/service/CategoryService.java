package com.example.server.service;

import com.example.server.dto.category.CategoryResponse;
import com.example.server.dto.category.CreateCategoryRequest;
import com.example.server.dto.MessageResponse;
import com.example.server.dto.category.UpdateCategoryRequest;
import com.example.server.entity.Category;
import com.example.server.entity.User;
import com.example.server.enums.CategoryIcon;
import com.example.server.enums.CategoryType;
import com.example.server.enums.Color;
import com.example.server.exception.ResourceNotFoundException;
import com.example.server.repository.CategoryRepository;
import com.example.server.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;

    private static final List<DefaultCategoryDef> DEFAULT_CATEGORIES = List.of(
            new DefaultCategoryDef("Храна", CategoryType.EXPENSE, CategoryIcon.FOOD, Color.CYAN),
            new DefaultCategoryDef("Ресторант", CategoryType.EXPENSE, CategoryIcon.RESTAURANT, Color.ORANGE),
            new DefaultCategoryDef("Транспорт", CategoryType.EXPENSE, CategoryIcon.TRANSPORT, Color.BLUE),
            new DefaultCategoryDef("Здравеопазване", CategoryType.EXPENSE, CategoryIcon.FIRST_AID, Color.RED),
            new DefaultCategoryDef("Домакинство", CategoryType.EXPENSE, CategoryIcon.HOUSE, Color.BLUE),
            new DefaultCategoryDef("Забавление", CategoryType.EXPENSE, CategoryIcon.SPORTS, Color.LIGHT_GREEN),
            new DefaultCategoryDef("Образование", CategoryType.EXPENSE, CategoryIcon.EDUCATION, Color.PINK),
            new DefaultCategoryDef("Други", CategoryType.EXPENSE, CategoryIcon.OTHERS, Color.RED),
            new DefaultCategoryDef("Заплата", CategoryType.INCOME, CategoryIcon.SALARY, Color.LIGHT_GREEN),
            new DefaultCategoryDef("Други", CategoryType.INCOME, CategoryIcon.OTHERS, Color.AMBER)
    );

    public void createDefaultCategories(User user) {
        List<Category> categories = DEFAULT_CATEGORIES.stream()
                .map(def -> Category.builder()
                        .user(user)
                        .name(def.name())
                        .type(def.type())
                        .icon(def.icon())
                        .color(def.color())
                        .isDefault(true)
                        .isActive(true)
                        .build())
                .toList();

        categoryRepository.saveAll(categories);
    }

    public CategoryResponse createCategory(User user, CreateCategoryRequest request) {
        if (categoryRepository.existsByUserAndNameAndTypeAndIsActiveTrue(user, request.getName(), request.getType())) {
            throw new IllegalArgumentException("Категория с това име и тип вече съществува");
        }

        Category category = Category.builder()
                .user(user)
                .name(request.getName())
                .type(request.getType())
                .icon(request.getIcon())
                .color(request.getColor())
                .isDefault(false)
                .isActive(true)
                .build();

        return CategoryResponse.fromEntity(categoryRepository.save(category));
    }

    public List<CategoryResponse> getUserCategories(User user) {
        return categoryRepository.findByUserAndIsActiveTrue(user).stream()
                .map(CategoryResponse::fromEntity)
                .toList();
    }

    public CategoryResponse updateCategory(User user, Integer categoryId, UpdateCategoryRequest request) {
        Category category = categoryRepository.findByIdAndUser(categoryId, user)
                .filter(Category::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Категорията не е намерена"));

        if (category.isDefault() && request.getName() != null) {
            throw new IllegalArgumentException("Не може да преименувате системна категория");
        }

        if (request.getName() != null) {
            if (!request.getName().equals(category.getName())
                    && categoryRepository.existsByUserAndNameAndTypeAndIsActiveTrue(user, request.getName(), category.getType())) {
                throw new IllegalArgumentException("Категория с това име и тип вече съществува");
            }
            category.setName(request.getName());
        }

        category.setIcon(request.getIcon());
        category.setColor(request.getColor());

        return CategoryResponse.fromEntity(categoryRepository.save(category));
    }

    public MessageResponse deleteCategory(User user, Integer categoryId) {
        Category category = categoryRepository.findByIdAndUser(categoryId, user)
                .filter(Category::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Категорията не е намерена"));

        if (category.isDefault()) {
            throw new IllegalArgumentException("Не може да изтриете системна категория");
        }

        if (transactionRepository.existsByCategoryId(categoryId)) {
            category.setActive(false);
            categoryRepository.save(category);
            return new MessageResponse("Категорията е деактивирана");
        }

        categoryRepository.delete(category);
        return new MessageResponse("Категорията е изтрита");
    }

    private record DefaultCategoryDef(String name, CategoryType type, CategoryIcon icon, Color color) {}
}
