package com.haocp.school_service.controllers;

import com.haocp.school_service.dtos.ApiResponse;
import com.haocp.school_service.dtos.requests.AddMajorRequest;
import com.haocp.school_service.dtos.requests.AddSubjectCombinationRequest;
import com.haocp.school_service.dtos.requests.AddSubjectRequest;
import com.haocp.school_service.dtos.responses.MajorResponse;
import com.haocp.school_service.dtos.responses.SubjectCombinationResponse;
import com.haocp.school_service.dtos.responses.SubjectResponse;
import com.haocp.school_service.services.SubjectService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/school")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubjectController {

   @Autowired
   SubjectService subjectService;

    @GetMapping("/subject")
    public ApiResponse<List<SubjectResponse>> subjects(){
        return ApiResponse.<List<SubjectResponse>>builder()
                .data(subjectService.subjects())
                .build();
    }

    @GetMapping("/subject-combo")
    public ApiResponse<List<SubjectCombinationResponse>> comboSubjects(){
        return ApiResponse.<List<SubjectCombinationResponse>>builder()
                .data(subjectService.comboSubjects())
                .build();
    }

    @GetMapping("/subject-combo/{codeCombination}")
    public ApiResponse<SubjectCombinationResponse> getSubject(@PathVariable String codeCombination){
        return ApiResponse.<SubjectCombinationResponse>builder()
                .data(subjectService.getComboSubject(codeCombination))
                .build();
    }

   @PostMapping("/subject")
   public ApiResponse<SubjectResponse> addSubject(@RequestBody AddSubjectRequest request) {
       return ApiResponse.<SubjectResponse>builder()
               .data(subjectService.addSubject(request))
               .build();
   }

    @PostMapping("/subject/import")
    public ApiResponse<List<SubjectResponse>> importSubjectByCSV(@RequestParam("file") MultipartFile file) {
        return ApiResponse.<List<SubjectResponse>>builder()
                .data(subjectService.importSubjectByCSV(file))
                .build();
    }

    @PostMapping("/subject-combo")
    public ApiResponse<SubjectCombinationResponse> addSubjectCombination(@RequestBody AddSubjectCombinationRequest request) {
       return ApiResponse.<SubjectCombinationResponse>builder()
               .data(subjectService.addSubjectCombination(request))
               .build();
    }

//    @PostMapping("/subject-combo/import")
//    public ApiResponse<List<SubjectCombinationResponse>> importComboByCSV(@RequestParam("file") MultipartFile file) {
//        return ApiResponse.<List<SubjectCombinationResponse>>builder()
//                .data(subjectService.importComboByCSV(file))
//                .build();
//    }

}
