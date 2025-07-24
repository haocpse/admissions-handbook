package com.haocp.auth_service.services;

import com.haocp.auth_service.dtos.responses.FavoriteUniversityResponse;
import com.haocp.auth_service.dtos.responses.UserResponse;

public interface UserService {

    FavoriteUniversityResponse getFavoriteUniversity();
    String identify();

    UserResponse getUser(String username);
}
