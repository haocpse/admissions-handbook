package com.haocp.school_service.entities;

import com.haocp.school_service.entities.enums.ScoreType;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class StandardScoreId implements Serializable {

    long universityId;
    long majorId;
    int year;

    @Enumerated(EnumType.STRING)
    ScoreType scoreType;

}
