package com.haocp.school_service.controllers;

import com.haocp.school_service.dtos.ApiResponse;
import com.haocp.school_service.dtos.requests.AddMajorRequest;
import com.haocp.school_service.dtos.requests.CreateScheduleRequest;
import com.haocp.school_service.dtos.requests.UpdateScheduleRequest;
import com.haocp.school_service.dtos.responses.CountDateResponse;
import com.haocp.school_service.dtos.responses.MajorResponse;
import com.haocp.school_service.dtos.responses.ScheduleResponse;
import com.haocp.school_service.services.ScheduleService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/uni")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ScheduleController {

    @Autowired
    ScheduleService scheduleService;

    @PostMapping("/schedule")
    public ApiResponse<ScheduleResponse> addSchedule(@RequestBody CreateScheduleRequest request) {
        return ApiResponse.<ScheduleResponse>builder()
                .data(scheduleService.addSchedule(request))
                .build();
    }

    @PutMapping("/schedule/{scheduleId}")
    public ApiResponse<ScheduleResponse> updateSchedule(@RequestBody UpdateScheduleRequest request, @PathVariable long scheduleId) {
        return ApiResponse.<ScheduleResponse>builder()
                .data(scheduleService.updateSchedule(request, scheduleId))
                .build();
    }

    @GetMapping("/schedule")
    public ApiResponse<List<ScheduleResponse>> getSchedule() {
        return ApiResponse.<List<ScheduleResponse>>builder()
                .data(scheduleService.getSchedule())
                .build();
    }

    @GetMapping("/v1/countdown")
    public ApiResponse<List<CountDateResponse>> countDate() {
        return ApiResponse.<List<CountDateResponse>>builder()
                .data(scheduleService.countDate())
                .build();
    }

}
