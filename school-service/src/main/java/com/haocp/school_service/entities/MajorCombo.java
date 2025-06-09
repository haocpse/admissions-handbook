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
@Table(name = "major_combos")
public class MajorCombo {

    @EmbeddedId
    MajorComboId majorComboId;

    @ManyToOne
    @MapsId("majorId")
    Major major;

    @ManyToOne
    @MapsId("codeCombination")
    SubjectCombination subjectCombination;

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
