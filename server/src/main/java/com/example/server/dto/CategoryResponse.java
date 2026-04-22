package com.example.server.dto;

import com.example.server.entity.Category;
import com.example.server.enums.CategoryIcon;
import com.example.server.enums.CategoryType;
import com.example.server.enums.Color;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {

    private Integer id;
    private String name;
    private CategoryType type;
    private CategoryIcon icon;
    private Color color;
    private boolean isDefault;
    private boolean isActive;

    public static CategoryResponse fromEntity(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .type(category.getType())
                .icon(category.getIcon())
                .color(category.getColor())
                .isDefault(category.isDefault())
                .isActive(category.isActive())
                .build();
    }
}
