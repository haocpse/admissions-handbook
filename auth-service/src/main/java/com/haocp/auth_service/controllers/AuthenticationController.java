package com.haocp.auth_service.controllers;

import com.haocp.auth_service.dtos.ApiResponse;
import com.haocp.auth_service.dtos.requests.CreateUserRequest;
import com.haocp.auth_service.dtos.requests.VerifyTokenRequest;
import com.haocp.auth_service.dtos.requests.LoginRequest;
import com.haocp.auth_service.dtos.responses.LoginResponse;
import com.haocp.auth_service.dtos.responses.UserResponse;
import com.haocp.auth_service.services.AuthService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationController {

    @Autowired
    AuthService authService;

    @PostMapping("/register")
    public ApiResponse<UserResponse> register(@RequestBody CreateUserRequest request){
        return ApiResponse.<UserResponse>builder()
                .data(authService.register(request))
                .build();
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request){
        return ApiResponse.<LoginResponse>builder()
                .data(authService.login(request))
                .build();
    }

    @PostMapping("/gmail-login")
    public ApiResponse<LoginResponse> gmailLogin(@RequestBody LoginRequest request){
        return ApiResponse.<LoginResponse>builder()
                .data(authService.login(request))
                .build();
    }

    @PostMapping("/introspect")
    public ApiResponse<Boolean> introspect(@RequestBody VerifyTokenRequest request){
        return ApiResponse.<Boolean>builder()
                .data(authService.introspect(request))
                .build();
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestBody VerifyTokenRequest request){
        authService.logout(request);
        return ApiResponse.<Void>builder()
                .build();
    }

    @PostMapping("/refresh")
    public ApiResponse<LoginResponse> refresh(@RequestBody VerifyTokenRequest request) {
        return ApiResponse.<LoginResponse>builder()
                .data(authService.refreshToken(request))
                .build();
    }

}
