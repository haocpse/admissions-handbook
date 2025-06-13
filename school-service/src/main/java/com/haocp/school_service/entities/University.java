package com.haocp.school_service.entities;

import com.haocp.school_service.entities.enums.UniMain;
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
@Table(name = "universities")
public class University {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long universityId;

    @Column(nullable = false, unique = true)
    String universityName;

    @Column(nullable = false)
    String code;

    @Column(nullable = false)
    String alias;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    UniMain main;

    @OneToMany(mappedBy = "university")
    List<UniversityMajor> universityMajors;

    @Column(nullable = false)
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
