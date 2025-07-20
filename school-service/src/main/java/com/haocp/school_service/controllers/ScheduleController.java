package com.haocp.school_service.controllers;

import com.haocp.school_service.dtos.ApiResponse;
import com.haocp.school_service.dtos.requests.AddMajorRequest;
import com.haocp.school_service.dtos.requests.CreateScheduleRequest;
import com.haocp.school_service.dtos.responses.MajorResponse;
import com.haocp.school_service.dtos.responses.ScheduleResponse;
import com.haocp.school_service.services.ScheduleService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/uni")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ScheduleController {

    @Autowired
    ScheduleService scheduleService;

    @PostMapping("/schedule")
    public ApiResponse<ScheduleResponse> addMajor(@RequestBody CreateScheduleRequest request) {
        return ApiResponse.<ScheduleResponse>builder()
                .data(scheduleService.addSchedule(request))
                .build();
    }

}
