package com.haocp.auth_service.mapper;

import com.haocp.auth_service.dtos.responses.UserResponse;
import com.haocp.auth_service.entities.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toUserResponse(User user);

}
