package com.haocp.school_service.repositories;

import com.haocp.school_service.entities.Major;
import jakarta.annotation.Nullable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MajorRepository extends JpaRepository<Major, Long> {

    @Nullable
    Major findByMajorName(String name);

}
