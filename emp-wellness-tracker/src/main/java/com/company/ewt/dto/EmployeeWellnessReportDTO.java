package com.company.ewt.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeWellnessReportDTO {
    private Long employeeId;
    private String employeeName;
    private String department;
    private List<SurveyScoreDTO> surveyScores;
    private Double overallWellnessScore;
    
}
