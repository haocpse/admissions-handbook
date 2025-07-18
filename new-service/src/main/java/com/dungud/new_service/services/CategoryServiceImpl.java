package com.dungud.new_service.services;

import com.dungud.new_service.dtos.responses.CategoryListResponse;
import com.dungud.new_service.dtos.responses.CategoryDetailResponse;
import com.dungud.new_service.entities.Category;
import com.dungud.new_service.repositories.CategoryRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryServiceImpl implements CategoryService {
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
