package com.company.ewt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.company.ewt.entity.Employee;
import com.company.ewt.entity.Report;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByEmployee(Employee employee);

    Optional<Report> findByEmployeeIdAndGeneratedAtAfter( Long employeeId, LocalDateTime timestamp);

}

