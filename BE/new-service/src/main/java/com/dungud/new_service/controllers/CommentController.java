package com.dungud.new_service.controllers;

import com.dungud.new_service.dtos.requests.CommentCreateRequest;
import com.dungud.new_service.dtos.requests.ReplyCommentRequest;
import com.dungud.new_service.dtos.requests.UpdateCommentRequest;
import com.dungud.new_service.dtos.responses.ApiResponse;
import com.dungud.new_service.dtos.responses.CommentDetailResponse;
import com.dungud.new_service.services.CommentService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentController {
    @Autowired
    private CommentService commentService;

    @PostMapping("/create")
    public ApiResponse<Void> createComment(@RequestBody CommentCreateRequest commentCreateRequest){
        commentService.createComment(commentCreateRequest);
        return ApiResponse.<Void>builder()
                .message("Create comment successfully")
                .build();
    }

    @DeleteMapping("/delete/{commentId}")
    public ApiResponse<Void> deleteComment(@PathVariable Long commentId){
        commentService.deleteComment(commentId);
        return ApiResponse.<Void>builder()
                .message("Delete comment successfully")
                .build();
    }

    @PutMapping("/update/{commentId}")
    public ApiResponse<Void> updateComment(@PathVariable Long commentId, @RequestBody UpdateCommentRequest request){
        commentService.updateComment(commentId, request);
        return ApiResponse.<Void>builder()
                .message("Update comment successfully")
                .build();
    }

    @PostMapping("/reply/{commentId}")
    public ApiResponse<Void> replyComment(@PathVariable Long commentId, @RequestBody ReplyCommentRequest request){
        commentService.replyComment(commentId, request);
        return ApiResponse.<Void>builder()
                .message("Reply comment successfully")
                .build();
    }

    @GetMapping("/detail/{commentId}")
    public ApiResponse<CommentDetailResponse> getComment(@PathVariable Long commentId){
        CommentDetailResponse commentDetailResponse = commentService.getCommentDetail(commentId);
        return ApiResponse.<CommentDetailResponse>builder()
                .data(commentDetailResponse)
                .build();
    }

    @GetMapping("/getAll")
    public ApiResponse<List<CommentDetailResponse>> getAllComments() {
        List<CommentDetailResponse> commentDetailResponses = commentService.getAllComments();
        return ApiResponse.<List<CommentDetailResponse>>builder()
                .data(commentDetailResponses)
                .build();
    }
}
