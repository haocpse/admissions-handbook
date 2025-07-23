package com.haocp.school_service.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@Entity
@Table(name = "schedules")
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long scheduleId;

    @Column(nullable = false)
    String content;

    @Column(nullable = false)
    LocalDateTime startDate;

    @Column()
    LocalDateTime endDate;

    @Column()
    String note;

    @Column(nullable = false)
    boolean disable;

    @Column(nullable = false)
    boolean mainSchedule;

}
