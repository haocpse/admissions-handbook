package com.haocp.school_service.repositories;

import com.haocp.school_service.entities.StandardScore;
import com.haocp.school_service.entities.StandardScoreId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StandardScoreRepository extends JpaRepository<StandardScore, StandardScoreId> {
}
