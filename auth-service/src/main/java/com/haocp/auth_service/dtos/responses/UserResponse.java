package com.haocp.auth_service.dtos.responses;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class UserResponse {

    String email;
    String username;
    String fullName;
    String phone;
    boolean isActive;

}
