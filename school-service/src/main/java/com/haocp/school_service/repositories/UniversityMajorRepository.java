package com.haocp.school_service.repositories;

import com.haocp.school_service.entities.UniversityMajor;
import com.haocp.school_service.entities.UniversityMajorId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UniversityMajorRepository extends JpaRepository<UniversityMajor, UniversityMajorId> {
}
