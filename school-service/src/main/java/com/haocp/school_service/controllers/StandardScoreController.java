package com.haocp.school_service.controllers;

import com.haocp.school_service.dtos.ApiResponse;
import com.haocp.school_service.dtos.requests.AddStandardScoreRequest;
import com.haocp.school_service.dtos.responses.StandardScoreResponse;
import com.haocp.school_service.services.StandardScoreService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/school")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StandardScoreController {

    @Autowired
    StandardScoreService standardScoreService;

    @PostMapping("/score")
    public ApiResponse<StandardScoreResponse> addMajorScore(@RequestBody AddStandardScoreRequest request) {
        return ApiResponse.<StandardScoreResponse>builder()
                .data(standardScoreService.addStandardScore(request))
                .build();
    }

    @PostMapping("/score/import")
    public ApiResponse<List<StandardScoreResponse>> importCSV(@RequestParam("file") MultipartFile file) {
        return ApiResponse.<List<StandardScoreResponse>>builder()
                .data(standardScoreService.importCSV(file))
                .build();
    }

}
