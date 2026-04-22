package com.example.server.dto;

import com.example.server.enums.CategoryIcon;
import com.example.server.enums.Color;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCategoryRequest {

    @Size(max = 80)
    private String name;

    @NotNull
    private CategoryIcon icon;

    @NotNull
    private Color color;
}
