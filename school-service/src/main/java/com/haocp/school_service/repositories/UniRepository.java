package com.haocp.school_service.repositories;

import com.haocp.school_service.entities.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UniRepository extends JpaRepository<University, Long> {

    List<University> findAllByActiveIsTrue();

    @Procedure(procedureName = "update_university_majors")
    void updateUniversityMajors(@Param("uni_id") Long uniId, @Param("majors_json") String majors_json);

}
