package com.dungud.new_service.controllers;

import com.dungud.new_service.dtos.responses.ApiResponse;
import com.dungud.new_service.dtos.responses.CategoryListResponse;
import com.dungud.new_service.services.CategoryService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/Categories")
@FieldDefaults(level = AccessLevel.PRIVATE)

public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping("/getAll")
    public ApiResponse<CategoryListResponse> getCategoryList() {
        CategoryListResponse categoryListResponse = categoryService.getCategoryList();
        return ApiResponse.<CategoryListResponse>builder()
                .data(categoryListResponse)
                .message("Get all categories successfully")
                .build();
    }

}
