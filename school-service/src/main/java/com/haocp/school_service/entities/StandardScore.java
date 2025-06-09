package com.haocp.school_service.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@Entity
@Table(name = "standard_scores")
public class StandardScore {

    @EmbeddedId
    StandardScoreId standardScoreId;

    @ManyToOne
    @MapsId("universityMajorId")
    @JoinColumns({
            @JoinColumn(name = "university_university_id", referencedColumnName = "university_university_id"),
            @JoinColumn(name = "major_major_id", referencedColumnName = "major_major_id")
    })
    UniversityMajor universityMajor;

    @Column(nullable = false)
    double score;

    @Column
    String note;

    @Column(nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    Date createdAt;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    Date updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = new Date();
        updatedAt = new Date();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = new Date();
    }

}
