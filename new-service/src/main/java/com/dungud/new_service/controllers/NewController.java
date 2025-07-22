package com.dungud.new_service.controllers;

import com.dungud.new_service.dtos.requests.NewCreateRequest;
import com.dungud.new_service.dtos.responses.ApiResponse;
import com.dungud.new_service.dtos.responses.NewDetailResponse;
import com.dungud.new_service.dtos.responses.NewListResponse;
import com.dungud.new_service.services.NewService;
import com.dungud.new_service.services.NewServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/news")
//@FieldDefaults(level = AccessLevel.PRIVATE)
public class NewController {
    @Autowired
    private NewService newService;

    @PostMapping("/create")
    public ApiResponse<Void> createNew(@RequestBody NewCreateRequest newCreateRequest) {
        newService.createNew(newCreateRequest);
        return ApiResponse.<Void>builder()
                .message("Create new successfully")
                .build();
    }

    @DeleteMapping("/delete/{newId}")
    public ApiResponse<Void> deleteNew(@PathVariable Long newId) {
        newService.deleteNew(newId);
        return ApiResponse.<Void>builder()
                .message("Delete new successfully")
                .build();
    }

    @GetMapping("/newDetail/{newId}")
    public ApiResponse<NewDetailResponse> getNewDetail(@PathVariable Long newId) {
        NewDetailResponse newDetailResponse = newService.getNewDetail(newId);
        return ApiResponse.<NewDetailResponse>builder()
                .data(newDetailResponse)
                .message("Get new detail successfully")
                .build();
    }

    @GetMapping("/GetAll")
    public ApiResponse<NewListResponse> getNewList(){
        NewListResponse newListResponse = newService.getNewList();
        return ApiResponse.<NewListResponse>builder()
                .data(newListResponse)
                .build();
    }
}
