package com.haocp.auth_service.services;

import com.haocp.auth_service.dtos.responses.*;
import com.haocp.auth_service.dtos.requests.*;

public interface AuthService {

    public UserResponse register(CreateUserRequest request);
    public LoginResponse login(LoginRequest request);
    public IntrospectResponse introspect(VerifyTokenRequest request);
    public void logout(VerifyTokenRequest request);
    public LoginResponse refreshToken(VerifyTokenRequest request);

}
