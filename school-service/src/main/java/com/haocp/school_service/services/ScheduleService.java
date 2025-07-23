package com.haocp.school_service.services;

import com.haocp.school_service.dtos.requests.CreateScheduleRequest;
import com.haocp.school_service.dtos.responses.CountDateResponse;
import com.haocp.school_service.dtos.responses.ScheduleResponse;

import java.util.List;

public interface ScheduleService {
    ScheduleResponse addSchedule(CreateScheduleRequest request);

    List<CountDateResponse> countDate();

    List<ScheduleResponse> getSchedule();
}
