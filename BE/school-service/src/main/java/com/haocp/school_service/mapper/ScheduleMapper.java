package com.haocp.school_service.mapper;

import com.haocp.school_service.dtos.requests.CreateScheduleRequest;
import com.haocp.school_service.dtos.requests.UpdateScheduleRequest;
import com.haocp.school_service.dtos.responses.ScheduleResponse;
import com.haocp.school_service.entities.Schedule;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ScheduleMapper {

    Schedule toSchedule(CreateScheduleRequest request);
    Schedule updateSchedule(UpdateScheduleRequest request, @MappingTarget Schedule schedule);
    ScheduleResponse toScheduleResponse(Schedule schedule);
}
