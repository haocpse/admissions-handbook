package com.haocp.school_service.controllers;

import com.haocp.school_service.dtos.ApiResponse;
import com.haocp.school_service.dtos.requests.AddUniversityRequest;
import com.haocp.school_service.dtos.requests.CheckScoreRequest;
import com.haocp.school_service.dtos.requests.UpdateMajorsOfUniRequest;
import com.haocp.school_service.dtos.responses.UniversityResponse;
import com.haocp.school_service.services.UniService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/school")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UniController {

    @Autowired
    UniService uniService;

    @GetMapping("/uni")
    public ApiResponse<List<UniversityResponse>> universities(){
        return ApiResponse.<List<UniversityResponse>>builder()
                .data(uniService.universities())
                .build();
    }

    @GetMapping("/uni/{universityId}")
    public ApiResponse<UniversityResponse> getUniversity(@PathVariable Long universityId){
        return ApiResponse.<UniversityResponse>builder()
                .data(uniService.getUniversity(universityId))
                .build();
    }

    @PostMapping("/uni")
    public ApiResponse<UniversityResponse> addUniversity(@RequestBody AddUniversityRequest request){
        return ApiResponse.<UniversityResponse>builder()
                .data(uniService.addUniversity(request))
                .build();
    }

    @PostMapping("/uni/import")
    public ApiResponse<List<UniversityResponse>> importCSV(@RequestParam("file") MultipartFile file){
        return ApiResponse.<List<UniversityResponse>>builder()
                .data(uniService.importCSV(file))
                .build();
    }

    @PutMapping("/{universityId}/majors")
    public ApiResponse<UniversityResponse> updateMajorsOfUni(@RequestBody UpdateMajorsOfUniRequest request, @PathVariable Long universityId){
        return ApiResponse.<UniversityResponse>builder()
                .data(uniService.updateMajorsOfUni(request, universityId))
                .build();
    }

    @GetMapping("/uni/by-combo")
    public ApiResponse<List<UniversityResponse>> getUniversitiesByCombo(@RequestParam String comboCode){
        return ApiResponse.<List<UniversityResponse>>builder()
                .data(uniService.getUniversitiesByCombo(comboCode))
                .build();
    }

    @GetMapping("/uni/by-score")
    public ApiResponse<List<UniversityResponse>> getUniversitiesByScore(@RequestBody CheckScoreRequest request){
        return ApiResponse.<List<UniversityResponse>>builder()
                .data(uniService.getUniversitiesByScore(request))
                .build();
    }

}
