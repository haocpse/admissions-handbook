package com.dungud.new_service.services;

import com.dungud.new_service.dtos.responses.CategoryListResponse;
import com.dungud.new_service.dtos.responses.CategoryDetailResponse;
import com.dungud.new_service.entities.Category;
import com.dungud.new_service.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public CategoryListResponse getCategoryList() {
        List<Category> categories = categoryRepository.findAll();
        List<CategoryDetailResponse> detailResponses = categories.stream()
                .map(category -> CategoryDetailResponse.builder()
                        .categoryId(category.getCategoryId())
                        .categoryName(category.getCategoryName())
                        .build())
                .toList();

        return CategoryListResponse.builder()
                .categories(detailResponses)
                .build();
    }
}
