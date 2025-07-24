package com.haocp.auth_service.dtos.responses;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class FavoriteUniversityResponse {

    UserResponse user;
    List<UniversityResponse> universities;

}
