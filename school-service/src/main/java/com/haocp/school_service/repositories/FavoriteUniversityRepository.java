package com.haocp.school_service.repositories;

import com.haocp.school_service.entities.FavoriteUniversity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteUniversityRepository extends JpaRepository<FavoriteUniversity, Long> {

    List<FavoriteUniversity> findByUsername(String username);
    FavoriteUniversity findByUsernameAndUniversityUniversityId(String username, Long universityId);

}
