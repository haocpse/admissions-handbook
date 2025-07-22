package com.haocp.school_service.controllers;

import com.haocp.school_service.dtos.ApiResponse;
import com.haocp.school_service.dtos.requests.*;
import com.haocp.school_service.dtos.responses.MajorComboResponse;
import com.haocp.school_service.dtos.responses.MajorResponse;
import com.haocp.school_service.dtos.responses.StandardScoreResponse;
import com.haocp.school_service.dtos.responses.UniversityResponse;
import com.haocp.school_service.entities.enums.ScoreType;
import com.haocp.school_service.services.MajorService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/uni")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MajorController {

    @Autowired
    MajorService majorService;

    @GetMapping("/v1/major")
    public ApiResponse<List<MajorResponse>> majors(){
        return ApiResponse.<List<MajorResponse>>builder()
                .data(majorService.majors())
                .build();
    }

    @GetMapping("/v1/major/{majorId}")
    public ApiResponse<MajorResponse> getMajor(@PathVariable Long majorId){
        return ApiResponse.<MajorResponse>builder()
                .data(majorService.getMajor(majorId, null))
                .build();
    }

    @PutMapping("/v1/major/{majorId}")
    public ApiResponse<MajorResponse> updateMajor(@PathVariable Long majorId, @RequestBody UpdateMajorRequest request){
        return ApiResponse.<MajorResponse>builder()
                .data(majorService.updateMajor(majorId, request))
                .build();
    }

    @DeleteMapping("/v1/major/{majorId}")
    public ApiResponse<MajorResponse> deleteMajor(@PathVariable Long majorId){
        return ApiResponse.<MajorResponse>builder()
                .data(majorService.deleteMajor(majorId))
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

    @PostMapping("/v1/score")
    public ApiResponse<StandardScoreResponse> addMajorScore(@RequestBody AddStandardScoreRequest request) {
        return ApiResponse.<StandardScoreResponse>builder()
                .data(majorService.addStandardScore(request))
                .build();
    }

    @PutMapping("/v1/score")
    public ApiResponse<StandardScoreResponse> updateMajorScore(@RequestBody UpdateStandardScoreRequest request) {
        return ApiResponse.<StandardScoreResponse>builder()
                .data(majorService.updateMajorScore(request))
                .build();
    }

    @DeleteMapping("/v1/score")
    public ApiResponse<Void> deleteMajorScore(@RequestParam Long universityId, @RequestParam Long majorId, @RequestParam int year, @RequestParam ScoreType type) {
        return ApiResponse.<Void>builder()
                .data(majorService.deleteMajorScore(universityId, majorId, year, type))
                .build();
    }

    @PostMapping("/score/import")
    public ApiResponse<List<StandardScoreResponse>> importScoreByCSV(@RequestParam("file") MultipartFile file) {
        return ApiResponse.<List<StandardScoreResponse>>builder()
                .data(majorService.importScoreByCSV(file))
                .build();
    }

    @GetMapping("/v1/major/by-uni")
    public ApiResponse<List<MajorResponse>> majors(@RequestParam Long universityId){
        return ApiResponse.<List<MajorResponse>>builder()
                .data(majorService.getMajorByUni(universityId))
                .build();
    }

    @PostMapping("/v1/major/by-uni")
    public ApiResponse<MajorComboResponse> addMajorsInUniversity(@RequestParam Long universityId, @RequestBody AddMajorComboInUniversityRequest request){
        return ApiResponse.<MajorComboResponse>builder()
                .data(majorService.addMajorsInUniversity(universityId, request))
                .build();
    }

    @PutMapping("/v1/{universityId}/major")
    public ApiResponse<MajorComboResponse> updateMajorsInUniversity(@PathVariable Long universityId, @RequestBody UpdateMajorComboInUniversityRequest request){
        return ApiResponse.<MajorComboResponse>builder()
                .data(majorService.updateMajorsInUniversity(universityId, request))
                .build();
    }

}
