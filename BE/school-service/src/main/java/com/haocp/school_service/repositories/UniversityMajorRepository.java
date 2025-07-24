package com.haocp.school_service.repositories;

import com.haocp.school_service.entities.UniversityMajor;
import com.haocp.school_service.entities.UniversityMajorId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UniversityMajorRepository extends JpaRepository<UniversityMajor, UniversityMajorId> {

    Optional<List<UniversityMajor>> findByUniversityUniversityId(Long universityId);
    List<UniversityMajor> findByMajorMajorId(Long majorId);
    List<UniversityMajor> findDistinctByMajorMajorIdIn(List<Long> majorIds);
    List<UniversityMajor> findByUniversityUniversityIdAndMajorMajorIdNotIn(Long universityId, List<Long> majorIds);
    void removeByUniversityUniversityIdAndMajorMajorIdIn(Long universityId, List<Long> majorIds);
    UniversityMajor findByUniversityUniversityIdAndMajorMajorId(Long universityId, Long majorId);
}
