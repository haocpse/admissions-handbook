package com.haocp.school_service.services;

import com.haocp.school_service.dtos.requests.CreateScheduleRequest;
import com.haocp.school_service.dtos.responses.ScheduleResponse;
import com.haocp.school_service.entities.Schedule;
import com.haocp.school_service.mapper.ScheduleMapper;
import com.haocp.school_service.repositories.ScheduleRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class ScheduleServiceImpl implements ScheduleService {

    @Autowired
    ScheduleRepository scheduleRepository;
    @Autowired
    ScheduleMapper scheduleMapper;

    @Override
    public ScheduleResponse addSchedule(CreateScheduleRequest request) {
        Schedule schedule = scheduleMapper.toSchedule(request);
        schedule.setMainSchedule(request.isMainSchedule());
        schedule.setDisable(true);
        ScheduleResponse response = scheduleMapper.toScheduleResponse(scheduleRepository.save(schedule));
        response.setMainSchedule(schedule.isMainSchedule());
        return response;
    }
}
