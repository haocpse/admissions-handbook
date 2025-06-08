package com.dungud.new_service.services;

import com.dungud.new_service.dtos.requests.NewCreateRequest;
import com.dungud.new_service.dtos.responses.CommentDetailResponse;
import com.dungud.new_service.dtos.responses.NewListResponse;
import com.dungud.new_service.dtos.responses.NewDetailResponse;
import com.dungud.new_service.entities.Category;
import com.dungud.new_service.entities.News;
import com.dungud.new_service.repositories.CategoryRepository;
import com.dungud.new_service.repositories.CommentRepository;
import com.dungud.new_service.repositories.NewRepository;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NewService {
    @Autowired
    private NewRepository newRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private CommentRepository commentRepository;

    public void createNew(NewCreateRequest request) {
        // Validate the request
        if (request == null || request.getLink() == null || request.getLink().isEmpty()) {
            throw new IllegalArgumentException("Invalid request: Link cannot be null or empty");
        }

        String link = request.getLink();
        String title = null;
        String thumbnail = null;

        try {
            Document doc = Jsoup.connect(link).get();
            title = doc.title();

            Element ogImage = doc.selectFirst("meta[property=og:image]");
            if (ogImage != null) {
                thumbnail = ogImage.attr("content");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch or parse the link", e);
        }

        News newsEntity = new News();
        newsEntity.setLink(link);
        newsEntity.setTitle(title);
        newsEntity.setThumbnail(thumbnail);
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid request: Category ID does not exist"));
        newsEntity.setCategory(category);
        newsEntity.setCreateAt(LocalDateTime.now());
        newRepository.save(newsEntity);
    }

    public void deleteNew(Long newId) {
        if (newId == null) {
            throw new IllegalArgumentException("Invalid request: News ID cannot be null");
        }
        newRepository.deleteById(newId);
    }

    public NewDetailResponse getNewDetail(Long newId) {
        if (newId == null) {
            throw new IllegalArgumentException("Invalid request: News ID cannot be null");
        }

        News newsEntity = newRepository.findById(newId)
                .orElseThrow(() -> new RuntimeException("News not found with ID: " + newId));

        List<CommentDetailResponse> commentDetailResponse = commentRepository.findCommentByNewsNewId(newId)
                .stream()
                .map(comment -> CommentDetailResponse.builder()
                        .userId(comment.getUserId())
                        .parentCommentId(comment.getParentCommentId())
                        .content(comment.getContent())
                        .build())
                .collect(Collectors.toList());

        return NewDetailResponse.builder()
                .link(newsEntity.getLink())
                .title(newsEntity.getTitle())
                .thumbnail(newsEntity.getThumbnail())
                .comments(commentDetailResponse)
                .build();
    }

    public NewListResponse getNewList() {
        List<News> newsList = newRepository.findAll();

        List<NewDetailResponse> newDetailResponses = newsList.stream()
                .map(newEntity -> NewDetailResponse.builder()
                        .link(newEntity.getLink())
                        .title(newEntity.getTitle())
                        .thumbnail(newEntity.getThumbnail())
                        .build())
                .collect(Collectors.toList());

        return NewListResponse.builder()
                .newDetailResponseList(newDetailResponses)
                .build();
    }

}
