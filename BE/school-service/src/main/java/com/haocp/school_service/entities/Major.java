package com.haocp.school_service.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@Entity
@Table(name = "majors")
public class Major {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long majorId;

    @Column(nullable = false, unique = true)
    String majorName;

    @OneToMany(mappedBy = "major")
    List<MajorCombo> majorCombos;

    @OneToMany(mappedBy = "major")
    List<UniversityMajor> universityMajors;

    @Column(nullable = false)
    @Builder.Default
    boolean active = true;

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
