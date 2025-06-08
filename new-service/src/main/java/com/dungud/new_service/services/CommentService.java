package com.dungud.new_service.services;

import com.dungud.new_service.dtos.requests.CommentCreateRequest;
import com.dungud.new_service.dtos.requests.ReplyCommentRequest;
import com.dungud.new_service.dtos.requests.UpdateCommentRequest;
import com.dungud.new_service.dtos.responses.CommentDetailResponse;
import com.dungud.new_service.entities.Comment;
import com.dungud.new_service.entities.News;
import com.dungud.new_service.repositories.CommentRepository;
import com.dungud.new_service.repositories.NewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private NewRepository newRepository;

    public void createComment(CommentCreateRequest commentCreateRequest) {
        // Validate the request
        if (commentCreateRequest == null || commentCreateRequest.getContent() == null || commentCreateRequest.getContent().isEmpty()) {
            throw new IllegalArgumentException("Invalid request: Content cannot be null or empty");
        }

        // Create and save the comment entity
        Comment comment = new Comment();
        comment.setUserId(commentCreateRequest.getUserId());
        comment.setContent(commentCreateRequest.getContent());

        News newsEntity = newRepository.findById(commentCreateRequest.getNewId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid request: News ID does not exist"));

        comment.setCreateAt(LocalDateTime.now());

        comment.setNews(newsEntity);

        commentRepository.save(comment);
    }

    public void deleteComment(Long commentId) {
        if (commentId == null) {
            throw new IllegalArgumentException("Invalid request: Comment ID cannot be null");
        }
        commentRepository.deleteById(commentId);
    }

    public void updateComment(Long commentId, UpdateCommentRequest request) {
        if (commentId == null || request.getContent() == null || request.getContent().isEmpty()) {
            throw new IllegalArgumentException("Invalid request: Comment ID and content cannot be null or empty");
        }

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid request: Comment ID does not exist"));
        comment.setContent(request.getContent());
        comment.setCreateAt(LocalDateTime.now());
        commentRepository.save(comment);
    }

    public void replyComment(Long commendId, ReplyCommentRequest request) {
        // Validate the request
        if (request == null || request.getContent() == null || request.getContent().isEmpty()) {
            throw new IllegalArgumentException("Invalid request: Content cannot be null or empty");
        }

        // Create and save the reply comment entity
        Comment replyComment = new Comment();
        replyComment.setUserId(request.getUserId());
        replyComment.setContent(request.getContent());
        News newsEntity = newRepository.findById(request.getNewId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid request: News ID does not exist"));
        replyComment.setNews(newsEntity);

        Comment parentComment = commentRepository.findById(commendId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid request: Parent comment ID does not exist"));

        replyComment.setParentCommentId(commendId);
        replyComment.setCreateAt(LocalDateTime.now());
        commentRepository.save(replyComment);
    }

    public CommentDetailResponse getCommentDetail(Long commentId) {
        if (commentId == null) {
            throw new IllegalArgumentException("Invalid request: Comment ID cannot be null");
        }

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid request: Comment ID does not exist"));
        return CommentDetailResponse.builder()
                .commentId(comment.getCommentId())
                .userId(comment.getUserId())
                .parentCommentId(comment.getParentCommentId())
                .createAt(comment.getCreateAt())
                .content(comment.getContent())
                .build();
    }

    public List<CommentDetailResponse> getAllComments() {
        List<Comment> comments = commentRepository.findAll();
        return comments.stream().map(comment -> CommentDetailResponse.builder()
                .commentId(comment.getCommentId())
                .userId(comment.getUserId())
                .parentCommentId(comment.getParentCommentId())
                .createAt(comment.getCreateAt())
                .content(comment.getContent())
                .build()).toList();
    }
    
}
