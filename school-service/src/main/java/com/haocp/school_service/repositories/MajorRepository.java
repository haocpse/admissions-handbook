package com.haocp.school_service.repositories;

import com.haocp.school_service.entities.Major;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MajorRepository extends JpaRepository<Major, Long> {

    Major findByMajorName(String name);

}
