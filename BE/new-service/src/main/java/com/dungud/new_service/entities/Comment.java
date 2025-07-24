package com.dungud.new_service.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "comments")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long commentId;

    @Column(nullable = false)
    String userId;

    Long parentCommentId;

    @Column(nullable = false)
    String content;

    @ManyToOne
    @JoinColumn(name = "new_id", nullable = false)
    News news;

    @Column(nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    LocalDateTime createAt;

    @PreUpdate
    public void preUpdate() {
        createAt = LocalDateTime.now();
    }
}
