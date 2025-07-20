package com.dungud.new_service.repositories;

import com.dungud.new_service.entities.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewRepository extends JpaRepository<News, Long> {
}
