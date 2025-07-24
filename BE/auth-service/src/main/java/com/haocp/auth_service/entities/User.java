package com.haocp.auth_service.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String userId;

    @Column(nullable = false)
    String email;

    String firstName;
    String lastName;
    String phone;

    @Column(nullable = false, unique = true)
    String username;
    @Column
    String password;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    Role role;

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
