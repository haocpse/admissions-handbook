package com.dungud.chat_service.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "community_Chats")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommunityChat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long communityChatId;

    String userId;
    String content;
    boolean isPin;

    Long parentCommunityChatId;

    @Column(nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    LocalDateTime createAt;

    @PreUpdate
    public void preUpdate() {
        createAt = LocalDateTime.now();
    }
}
