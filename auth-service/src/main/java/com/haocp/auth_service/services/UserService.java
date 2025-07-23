package com.haocp.auth_service.services;

import com.haocp.auth_service.dtos.responses.FavoriteUniversityResponse;

public interface UserService {

    FavoriteUniversityResponse getFavoriteUniversity();
    String identify();

}
