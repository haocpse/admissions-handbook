package com.haocp.api_gateway.services;

import com.haocp.api_gateway.dtos.ApiResponse;
import com.haocp.api_gateway.dtos.requests.IntrospectResponse;
import com.haocp.api_gateway.dtos.requests.VerifyTokenRequest;
import com.haocp.api_gateway.repositories.AuthClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthService {

    AuthClient authClient;

    public Mono<ApiResponse<IntrospectResponse>> introspect(String token){
        return authClient.introspect(VerifyTokenRequest.builder()
                        .token(token)
                .build());
    }

}
