package com.company.ewt.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.ewt.service.SurveyResponseService;
import com.company.ewt.dto.EmployeeWellnessReportDTO;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private SurveyResponseService surveyResponseService;

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<EmployeeWellnessReportDTO> getEmployeeWellnessReport(@PathVariable Long employeeId) {
        EmployeeWellnessReportDTO report = surveyResponseService.getEmployeeWellnessReport(employeeId);
        return ResponseEntity.ok(report);
    }
}
 