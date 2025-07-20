package com.dungud.new_service.dtos.requests;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
//@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class NewCreateRequest {
    String link;
    Long categoryId;
}
