package com.haocp.school_service.repositories;

import com.haocp.school_service.entities.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {

    Optional<Subject> findBySubjectName(String subjectName);
    Boolean existsBySubjectName(String subjectName);

}
