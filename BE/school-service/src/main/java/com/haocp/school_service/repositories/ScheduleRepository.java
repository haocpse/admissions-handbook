package com.haocp.school_service.repositories;

import com.haocp.school_service.entities.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    List<Schedule> findAllByMainSchedule(boolean mainSchedule);
    Schedule findByContent(String content);

}
