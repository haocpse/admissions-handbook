package com.haocp.school_service.repositories;

import com.haocp.school_service.entities.ComboSubject;
import com.haocp.school_service.entities.ComboSubjectId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComboSubjectRepository extends JpaRepository<ComboSubject, ComboSubjectId> {

    Optional<List<ComboSubject>> findBySubjectCombinationCodeCombination(String codeCombination);
    List<ComboSubject> findBySubjectCombinationCodeCombinationAndSubjectSubjectIdNotIn(String codeCombination, List<Long> subjectIds);

}
