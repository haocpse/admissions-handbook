package com.haocp.auth_service.services;

import com.haocp.auth_service.dtos.ApiResponse;
import com.haocp.auth_service.dtos.responses.FavoriteUniversityResponse;
import com.haocp.auth_service.dtos.responses.UniversityResponse;
import com.haocp.auth_service.exceptions.AppException;
import com.haocp.auth_service.exceptions.ErrorCode;
import com.haocp.auth_service.mapper.UserMapper;
import com.haocp.auth_service.repositories.SchoolClient.SchoolClient;
import com.haocp.auth_service.repositories.UserRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserService {

    @Autowired
    SchoolClient schoolClient;
    @Autowired
    UserRepository userRepository;
    @Autowired
    UserMapper userMapper;

    public FavoriteUniversityResponse getFavoriteUniversity() {
        String userId = identify();
        if (userId == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        ApiResponse<List<UniversityResponse>> response = schoolClient.getFavorites(userId);
        if (response.getCode() == 200 ) {
            return FavoriteUniversityResponse.builder()
                    .user(userMapper.toUserResponse(userRepository.getReferenceById(userId)))
                    .universities(response.getData())
                    .build();
        }
        return null;
    }

    public String identify() {
        var context = SecurityContextHolder.getContext();
        var authentication = context.getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return null;
    }

}
