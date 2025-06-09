package com.haocp.school_service.repositories;

import com.haocp.school_service.entities.ComboSubject;
import com.haocp.school_service.entities.ComboSubjectId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComboSubjectRepository extends JpaRepository<ComboSubject, ComboSubjectId> {
}
