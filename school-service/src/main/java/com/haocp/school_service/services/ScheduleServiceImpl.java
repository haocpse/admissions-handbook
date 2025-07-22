package com.haocp.school_service.services;

import com.haocp.school_service.dtos.requests.CreateScheduleRequest;
import com.haocp.school_service.dtos.requests.UpdateScheduleRequest;
import com.haocp.school_service.dtos.responses.CountDateResponse;
import com.haocp.school_service.dtos.responses.ScheduleResponse;
import com.haocp.school_service.entities.Schedule;
import com.haocp.school_service.mapper.ScheduleMapper;
import com.haocp.school_service.repositories.ScheduleRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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
        schedule.setDisable(false);

        ScheduleResponse response = scheduleMapper.toScheduleResponse(scheduleRepository.save(schedule));
        response.setMainSchedule(schedule.isMainSchedule());
        return response;
    }

    @Override
    public ScheduleResponse updateSchedule(UpdateScheduleRequest request, long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        schedule = scheduleMapper.updateSchedule(request, schedule);
        ScheduleResponse response = scheduleMapper.toScheduleResponse(scheduleRepository.save(schedule));
        response.setMainSchedule(schedule.isMainSchedule());
        return response;
    }

    @Override
    public List<CountDateResponse> countDate() {
        List<CountDateResponse> responses = new ArrayList<>();
        List<Schedule> schedules = scheduleRepository.findAllByMainSchedule(true);

        for (Schedule schedule : schedules) {
            CountDateResponse response = CountDateResponse.builder()
                    .content(schedule.getContent())
                    .startTime(schedule.getStartDate())
                    .endTime(schedule.getEndDate())
                    .build();
            responses.add(response);
        }
        return responses;
    }

    @Override
    public List<ScheduleResponse> getSchedule() {
        List<Schedule> schedules = scheduleRepository.findAll();
        List<ScheduleResponse> responses = new ArrayList<>();
        for (Schedule schedule : schedules) {
            ScheduleResponse response = scheduleMapper.toScheduleResponse(schedule);
            response.setMainSchedule(schedule.isMainSchedule());
            responses.add(response);
        }
        return responses;
    }


}
