package com.company.ewt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.company.ewt.entity.Survey;

import java.util.*;

// for interact with database

@Repository
public interface SurveyRepository extends JpaRepository<Survey,Long>{
    //fetch only active surveys
    List<Survey> findByStatusTrue();
    
}
