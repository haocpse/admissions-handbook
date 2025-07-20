package com.dungud.chat_service.repositories;

import com.dungud.chat_service.entities.CommunityChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunityChatRepository extends JpaRepository<CommunityChat, Long>{
}
