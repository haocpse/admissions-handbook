package com.dungud.new_service.services;

import com.dungud.new_service.dtos.requests.CommentCreateRequest;
import com.dungud.new_service.dtos.requests.ReplyCommentRequest;
import com.dungud.new_service.dtos.requests.UpdateCommentRequest;
import com.dungud.new_service.dtos.responses.CommentDetailResponse;

import java.util.List;

public interface CommentService {
    void createComment(CommentCreateRequest commentCreateRequest);
    void deleteComment(Long commentId);
    void updateComment(Long commentId, UpdateCommentRequest request);
    void replyComment(Long commendId, ReplyCommentRequest request);
    CommentDetailResponse getCommentDetail(Long commentId);
    List<CommentDetailResponse> getAllComments();
}
