package com.dungud.chat_service.repositories;

import com.dungud.chat_service.entities.CommunityChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityChatRepository extends JpaRepository<CommunityChat, Long>{

    List<CommunityChat> findByParentCommunityChatId(Long parentCommunityChatId);
}
