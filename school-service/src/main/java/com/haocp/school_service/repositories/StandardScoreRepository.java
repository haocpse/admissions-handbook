package com.haocp.school_service.repositories;

import com.haocp.school_service.entities.StandardScore;
import com.haocp.school_service.entities.StandardScoreId;
import com.haocp.school_service.entities.enums.ScoreType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StandardScoreRepository extends JpaRepository<StandardScore, StandardScoreId> {

    List<StandardScore> findStandardScoreByScoreIsLessThanEqualAndStandardScoreIdScoreType(double score, ScoreType scoreType);

}
