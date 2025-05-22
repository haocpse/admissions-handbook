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
@Table(name = "university_majors")
public class UniversityMajor {

    @EmbeddedId
    UniversityMajorId id;

    @ManyToOne
    @MapsId("universityId")
    University university;

    @ManyToOne
    @MapsId("majorId")
    Major major;

    @Column(nullable = false)
    boolean active = true;

    @Column(nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    Date createdAt = new Date();

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    Date updatedAt = new Date();

    @PreUpdate
    public void preUpdate() {
        updatedAt = new Date();
    }

}
