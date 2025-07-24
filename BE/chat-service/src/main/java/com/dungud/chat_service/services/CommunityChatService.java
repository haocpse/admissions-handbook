package com.dungud.chat_service.services;

import com.dungud.chat_service.dtos.request.ChatCreateRequest;
import com.dungud.chat_service.dtos.request.ChatReplyRequest;
import com.dungud.chat_service.dtos.request.ChatUpdateRequest;
import com.dungud.chat_service.dtos.response.ChatListDetailResponse;

public interface CommunityChatService {
    void createChat(ChatCreateRequest chatCreateRequest);
    void pinChat(Long chatId);
    void unpinChat(Long chatId);
    void deleteChat(Long chatId);
    void updateChat(Long chatId, ChatUpdateRequest request);
    void replyChat(Long chatId, ChatReplyRequest request);
    ChatListDetailResponse getAll();
}
