package com.haocp.school_service.controllers;

import com.haocp.school_service.dtos.ApiResponse;
import com.haocp.school_service.dtos.requests.AddMajorComboRequest;
import com.haocp.school_service.dtos.requests.AddMajorRequest;
import com.haocp.school_service.dtos.requests.AddStandardScoreRequest;
import com.haocp.school_service.dtos.responses.MajorComboResponse;
import com.haocp.school_service.dtos.responses.MajorResponse;
import com.haocp.school_service.dtos.responses.StandardScoreResponse;
import com.haocp.school_service.dtos.responses.UniversityResponse;
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

    @GetMapping("/major")
    public ApiResponse<List<MajorResponse>> majors(){
        return ApiResponse.<List<MajorResponse>>builder()
                .data(majorService.majors())
                .build();
    }

    @GetMapping("/major/{majorId}")
    public ApiResponse<MajorResponse> getMajor(@PathVariable Long majorId){
        return ApiResponse.<MajorResponse>builder()
                .data(majorService.getMajor(majorId))
                .build();
    }

    @PostMapping("/major")
    public ApiResponse<MajorResponse> addMajor(@RequestBody AddMajorRequest addMajorRequest) {
        return ApiResponse.<MajorResponse>builder()
                .data(majorService.addMajor(addMajorRequest))
                .build();
    }

    @PostMapping("/major/import")
    public ApiResponse<List<MajorResponse>> importMajorByCSV(@RequestParam("file") MultipartFile file) {
        return ApiResponse.<List<MajorResponse>>builder()
                .data(majorService.importMajorByCSV(file))
                .build();
    }

    @PostMapping("/major/combo")
    public ApiResponse<MajorComboResponse> addMajorCombo(@RequestBody AddMajorComboRequest addMajorRequest) {
        return ApiResponse.<MajorComboResponse>builder()
                .data(majorService.addMajorCombo(addMajorRequest))
                .build();
    }

    @PostMapping("/score")
    public ApiResponse<StandardScoreResponse> addMajorScore(@RequestBody AddStandardScoreRequest request) {
        return ApiResponse.<StandardScoreResponse>builder()
                .data(majorService.addStandardScore(request))
                .build();
    }

    @PostMapping("/score/import")
    public ApiResponse<List<StandardScoreResponse>> importScoreByCSV(@RequestParam("file") MultipartFile file) {
        return ApiResponse.<List<StandardScoreResponse>>builder()
                .data(majorService.importScoreByCSV(file))
                .build();
    }

    @GetMapping("/major/by-uni")
    public ApiResponse<List<MajorResponse>> majors(@RequestParam Long universityId){
        return ApiResponse.<List<MajorResponse>>builder()
                .data(majorService.getMajorByUni(universityId))
                .build();
    }

}
