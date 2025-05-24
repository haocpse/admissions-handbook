package com.haocp.school_service.controllers;

import com.haocp.school_service.dtos.ApiResponse;
import com.haocp.school_service.dtos.requests.AddMajorRequest;
import com.haocp.school_service.dtos.responses.MajorResponse;
import com.haocp.school_service.services.MajorService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/school")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MajorController {

    @Autowired
    MajorService majorService;

    @PostMapping("/major")
    public ApiResponse<MajorResponse> addMajor(@RequestBody AddMajorRequest addMajorRequest) {
        return ApiResponse.<MajorResponse>builder()
                .data(majorService.addMajor(addMajorRequest))
                .build();
    }

    @PostMapping("/major/import")
    public ApiResponse<List<MajorResponse>> importCSV(@RequestParam("file") MultipartFile file) {
        return ApiResponse.<List<MajorResponse>>builder()
                .data(majorService.importCSV(file))
                .build();
    }

}
