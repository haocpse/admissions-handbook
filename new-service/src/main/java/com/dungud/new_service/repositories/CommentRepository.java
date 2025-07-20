package com.dungud.new_service.repositories;

import com.dungud.new_service.dtos.responses.CommentDetailResponse;
import com.dungud.new_service.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findCommentByNewsNewId(Long newId);
}
