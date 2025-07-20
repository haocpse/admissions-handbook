package com.haocp.school_service.services;

import com.haocp.school_service.dtos.requests.CreateScheduleRequest;
import com.haocp.school_service.dtos.responses.ScheduleResponse;

public interface ScheduleService {
    ScheduleResponse addSchedule(CreateScheduleRequest request);
}
