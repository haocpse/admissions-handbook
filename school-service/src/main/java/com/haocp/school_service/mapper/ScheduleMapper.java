package com.haocp.school_service.mapper;

import com.haocp.school_service.dtos.requests.CreateScheduleRequest;
import com.haocp.school_service.dtos.responses.ScheduleResponse;
import com.haocp.school_service.entities.Schedule;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ScheduleMapper {

    Schedule toSchedule(CreateScheduleRequest request);
    ScheduleResponse toScheduleResponse(Schedule schedule);
}
