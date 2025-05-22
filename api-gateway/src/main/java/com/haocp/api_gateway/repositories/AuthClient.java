package com.haocp.api_gateway.repositories;

import com.haocp.api_gateway.dtos.ApiResponse;
import com.haocp.api_gateway.dtos.requests.VerifyTokenRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.PostExchange;
import reactor.core.publisher.Mono;

public interface AuthClient {

    @PostExchange(url = "/api/auth/introspect", contentType = MediaType.APPLICATION_JSON_VALUE)
    Mono<ApiResponse<Boolean>> introspect(@RequestBody VerifyTokenRequest request);
}
