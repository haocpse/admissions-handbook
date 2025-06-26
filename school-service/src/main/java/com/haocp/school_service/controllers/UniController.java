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
@RequestMapping("/api/uni")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UniController {

    @Autowired
    UniService uniService;

    @GetMapping("/v1")
    public ApiResponse<List<UniversityResponse>> universities(){
        return ApiResponse.<List<UniversityResponse>>builder()
                .data(uniService.universities())
                .build();
    }

    @GetMapping("/v1/{universityId}")
    public ApiResponse<UniversityResponse> getUniversity(@PathVariable Long universityId){
        return ApiResponse.<UniversityResponse>builder()
                .data(uniService.getUniversity(universityId))
                .build();
    }

    @PostMapping()
    public ApiResponse<UniversityResponse> addUniversity(@RequestBody AddUniversityRequest request){
        return ApiResponse.<UniversityResponse>builder()
                .data(uniService.addUniversity(request))
                .build();
    }

    @PostMapping("/import")
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

    @GetMapping("/v1/by-combo")
    public ApiResponse<List<UniversityResponse>> getUniversitiesByCombo(@RequestParam String comboCode){
        return ApiResponse.<List<UniversityResponse>>builder()
                .data(uniService.getUniversitiesByCombo(comboCode))
                .build();
    }

    @GetMapping("/v1/by-score")
    public ApiResponse<List<UniversityResponse>> getUniversitiesByScore(@RequestBody CheckScoreRequest request){
        return ApiResponse.<List<UniversityResponse>>builder()
                .data(uniService.getUniversitiesByScore(request))
                .build();
    }

    @GetMapping("/v2/favorite/{username}")
    public ApiResponse<List<UniversityResponse>> getFavorites(@PathVariable("username") String username){
        return ApiResponse.<List<UniversityResponse>>builder()
                .data(uniService.getFavorites(username))
                .build();
    }

    @GetMapping("/v2/favorite")
    public ApiResponse<List<UniversityResponse>> getMyFavorites(@RequestHeader("X-User-Name") String username){
        return ApiResponse.<List<UniversityResponse>>builder()
                .data(uniService.getFavorites(username))
                .build();
    }

    @PostMapping("/favorite/{universityId}")
    public ApiResponse<UniversityResponse> addFavorites(@PathVariable("universityId") long universityId, @RequestHeader("X-User-Name") String username ){
        return ApiResponse.<UniversityResponse>builder()
                .data(uniService.addFavorites(universityId, username))
                .build();
    }

}
