package com.haocp.auth_service.services;

import com.haocp.auth_service.dtos.responses.*;
import com.haocp.auth_service.dtos.requests.*;

public interface AuthService {

    UserResponse register(CreateUserRequest request);
    LoginResponse login(LoginRequest request);
    IntrospectResponse introspect(VerifyTokenRequest request);
    void logout(VerifyTokenRequest request);
    LoginResponse refreshToken(VerifyTokenRequest request);

    LoginResponse gmailLogin(GmailLoginRequest request);
}
