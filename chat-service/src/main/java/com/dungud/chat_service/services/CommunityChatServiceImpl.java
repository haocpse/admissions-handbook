package com.dungud.chat_service.services;

import com.dungud.chat_service.dtos.request.ChatCreateRequest;
import com.dungud.chat_service.dtos.request.ChatReplyRequest;
import com.dungud.chat_service.dtos.request.ChatUpdateRequest;
import com.dungud.chat_service.dtos.response.ChatDetailResponse;
import com.dungud.chat_service.dtos.response.ChatListDetailResponse;
import com.dungud.chat_service.entities.CommunityChat;
import com.dungud.chat_service.repositories.CommunityChatRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommunityChatServiceImpl implements CommunityChatService {
    @Autowired
    private CommunityChatRepository communityChatRepository;

    public void createChat(ChatCreateRequest chatCreateRequest) {
        // Validate the request
        if (chatCreateRequest == null || chatCreateRequest.getContent() == null || chatCreateRequest.getContent().isEmpty()) {
            throw new IllegalArgumentException("Invalid request: Content cannot be null or empty");
        }

        // Create and save the community chat entity
        CommunityChat communityChat = new CommunityChat();
        communityChat.setUserId(chatCreateRequest.getUserId());
        communityChat.setContent(chatCreateRequest.getContent());
        communityChat.setCreateAt(LocalDateTime.now());
        communityChat.setPin(false);
        communityChatRepository.save(communityChat);
    }

    public void pinChat(Long chatId) {
        if (chatId == null) {
            throw new IllegalArgumentException("Invalid request: Chat ID cannot be null");
        }

        CommunityChat communityChat = communityChatRepository.findById(chatId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid request: Chat ID does not exist"));

        communityChat.setPin(true);
        communityChatRepository.save(communityChat);
    }

    public void unpinChat(Long chatId) {
        if (chatId == null) {
            throw new IllegalArgumentException("Invalid request: Chat ID cannot be null");
        }

        CommunityChat communityChat = communityChatRepository.findById(chatId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid request: Chat ID does not exist"));

        communityChat.setPin(false);
        communityChatRepository.save(communityChat);
    }

    public void deleteChat(Long chatId) {
        if (chatId == null) {
            throw new IllegalArgumentException("Invalid request: Chat ID cannot be null");
        }
        communityChatRepository.deleteById(chatId);
    }

    public void updateChat(Long chatId, ChatUpdateRequest request) {
        if (chatId == null || request.getContent() == null || request.getContent().isEmpty()) {
            throw new IllegalArgumentException("Invalid request: Chat ID and content cannot be null or empty");
        }

        CommunityChat communityChat = communityChatRepository.findById(chatId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid request: Chat ID does not exist"));
        communityChat.setContent(request.getContent());
        communityChat.setCreateAt(LocalDateTime.now());
        communityChatRepository.save(communityChat);
    }

    public void replyChat(Long chatId, ChatReplyRequest request) {
        // Validate the request
        if (request == null || request.getContent() == null || request.getContent().isEmpty()) {
            throw new IllegalArgumentException("Invalid request: Content cannot be null or empty");
        }

        // Create and save the reply community chat entity
        CommunityChat replyChat = new CommunityChat();
        replyChat.setUserId(request.getUserId());
        replyChat.setContent(request.getContent());
        replyChat.setCreateAt(LocalDateTime.now());
        replyChat.setParentCommunityChatId(chatId);
        communityChatRepository.save(replyChat);
    }

    public ChatListDetailResponse getAll() {
        List<CommunityChat> chats = communityChatRepository.findAll();
        return ChatListDetailResponse.builder()
                .chatListDetails(chats.stream()  // Changed from ChatDetailResponse to chatDetails
                        .map(chat -> ChatDetailResponse.builder()
                                .communityChatId(chat.getCommunityChatId())
                                .userId(chat.getUserId())
                                .content(chat.getContent())
                                .isPin(chat.isPin())
                                .parentCommunityChatId(chat.getParentCommunityChatId())
                                .createAt(chat.getCreateAt())
                                .build())
                        .toList())
                .build();
    }
}
