package com.haocp.auth_service.repositories.SchoolClient;

import com.haocp.auth_service.dtos.ApiResponse;
import com.haocp.auth_service.dtos.responses.UniversityResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "SCHOOL-SERVICE")
public interface SchoolClient {

    @GetMapping("/api/uni/favorite/{userId}")
    ApiResponse<List<UniversityResponse>> getFavorites(@PathVariable("userId") String userId);

}
