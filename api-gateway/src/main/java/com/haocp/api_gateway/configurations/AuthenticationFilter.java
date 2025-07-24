package com.haocp.api_gateway.configurations;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.haocp.api_gateway.dtos.ApiResponse;
import com.haocp.api_gateway.dtos.requests.IntrospectResponse;
import com.haocp.api_gateway.repositories.AuthClient;
import com.haocp.api_gateway.services.AuthService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.apache.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationFilter implements GlobalFilter, Ordered {
    @Autowired
    AuthService authService;
    @Autowired
    ObjectMapper objectMapper;

    record PublicRoute(String method, String pattern) {}

    List<PublicRoute> publicRoutes = List.of(
            new PublicRoute("POST", "/api/auth/.*"),
            new PublicRoute("GET", "^/api/uni/v1(/.*)?$"),
            new PublicRoute("POST", "^/api/chatbot(/.*)?$"),
            new PublicRoute("POST", "/api/communityChats/create"),
            new PublicRoute("POST", "/api/communityChats/replyChat/.*"),
            new PublicRoute("GET", "/api/communityChats/getAllChats"),
            new PublicRoute("GET", "/api/news/.*"),
            new PublicRoute("GET", "/api/user/.*"),
            new PublicRoute("GET", "/uploads/.*")
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        if (isPublicEndPoint(exchange.getRequest()))
            return chain.filter(exchange);

        List<String> authHeaders = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION);
        if(CollectionUtils.isEmpty(authHeaders))
            return unauthenticated(exchange.getResponse());

        String token = authHeaders.getFirst().replace("Bearer ", "");
        return authService.introspect(token).flatMap(booleanApiResponse -> {
            IntrospectResponse data = booleanApiResponse.getData();
            if (data != null && Boolean.TRUE.equals(data.getValid())) {
                ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                        .header("X-User-Name", data.getUsername())
                        .build();

                ServerWebExchange mutatedExchange = exchange.mutate()
                        .request(mutatedRequest)
                        .build();

                return chain.filter(mutatedExchange);
            }
            else
                return unauthenticated(exchange.getResponse());
        });
    }

    private boolean isPublicEndPoint(ServerHttpRequest request) {
        String path = request.getURI().getPath();
        request.getMethod();
        String method = request.getMethod().name();
        return publicRoutes.stream()
                .anyMatch(route -> method.equalsIgnoreCase(route.method())
                        && path.matches(route.pattern()));
    }

    @Override
    public int getOrder() {
        return -1;
    }

    Mono<Void> unauthenticated(ServerHttpResponse response) {
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(HttpStatus.UNAUTHORIZED.value())
                .message("Unauthenticated")
                .build();
        String body = null;
        try {
            body = objectMapper.writeValueAsString(apiResponse);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        return response.writeWith(Mono.just(response.bufferFactory().wrap(body.getBytes())));
    }

}
