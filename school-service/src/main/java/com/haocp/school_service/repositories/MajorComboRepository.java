package com.haocp.school_service.repositories;

import com.haocp.school_service.entities.MajorCombo;
import com.haocp.school_service.entities.MajorComboId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MajorComboRepository extends JpaRepository<MajorCombo, MajorComboId> {

    Optional<List<MajorCombo>> findMajorComboByMajorMajorId(Long id);
    Optional<List<MajorCombo>> findMajorComboBySubjectCombinationCodeCombination(String codeCombination);

}
