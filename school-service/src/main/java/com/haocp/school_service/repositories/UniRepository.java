package com.haocp.school_service.repositories;

import com.haocp.school_service.entities.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UniRepository extends JpaRepository<University, Long> {

    @Procedure(procedureName = "update_university_majors")
    void updateUniversityMajors(@Param("uni_id") Long uniId, @Param("majors_json") String majors_json);

}
