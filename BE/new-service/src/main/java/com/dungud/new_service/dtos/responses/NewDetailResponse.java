package com.dungud.new_service.dtos.responses;

import com.dungud.new_service.entities.Comment;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class NewDetailResponse {
    Long newId;
    String link;
    String title;
    String thumbnail;
    List<CommentDetailResponse> comments;
    String categoryName;
}
