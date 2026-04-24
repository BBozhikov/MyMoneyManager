package com.example.server.dto.statistics;

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
public class CategoryStatisticsResponse {

    private String categoryName;
    private CategoryType type;
    private CategoryIcon icon;
    private Color color;
    private double totalAmount;
}
