package com.haocp.school_service.controllers;

import com.haocp.school_service.dtos.ApiResponse;
import com.haocp.school_service.dtos.requests.AddSubjectRequest;
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

   @PostMapping("/subject")
   public ApiResponse<SubjectResponse> addSubject(@RequestBody AddSubjectRequest request) {
       return ApiResponse.<SubjectResponse>builder()
               .data(subjectService.addSubject(request))
               .build();
   }

    @PostMapping("/subject/import")
    public ApiResponse<List<SubjectResponse>> importCSV(@RequestParam("file") MultipartFile file) {
        return ApiResponse.<List<SubjectResponse>>builder()
                .data(subjectService.importCSV(file))
                .build();
    }

}
