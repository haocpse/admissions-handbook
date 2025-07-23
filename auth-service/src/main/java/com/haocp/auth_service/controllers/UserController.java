package com.haocp.auth_service.controllers;

import com.haocp.auth_service.dtos.ApiResponse;
import com.haocp.auth_service.dtos.responses.FavoriteUniversityResponse;
import com.haocp.auth_service.services.UserService;
import com.haocp.auth_service.services.UserServiceImpl;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserController {

    @Autowired
    UserService userService;

    @GetMapping("/favorite")
    public ApiResponse<FavoriteUniversityResponse> getFavoriteUniversity() {
        return ApiResponse.<FavoriteUniversityResponse>builder()
                .data(userService.getFavoriteUniversity())
                .build();
    }

}
