package com.company.ewt.service;

import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.company.ewt.dto.EmployeeWellnessReportDTO;
import com.company.ewt.dto.SurveyScoreDTO;
import com.company.ewt.entity.Employee;
import com.company.ewt.entity.Report;
import com.company.ewt.entity.Survey;
import com.company.ewt.entity.SurveyResponse;
import com.company.ewt.repository.EmployeeRepository;
import com.company.ewt.repository.ReportRepository;
import com.company.ewt.repository.SurveyRepository;
import com.company.ewt.repository.SurveyResponseRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SurveyResponseService {
    @Autowired
    private SurveyResponseRepository responseRepository;
    
    @Autowired
    private SurveyRepository surveyRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ReportRepository  reportRepository;


    private double calculateWellnessScore(String responses) {
        if (responses == null || responses.trim().isEmpty()) {
            return 0.0;
        }
        
        // Assuming responses are stored as comma-separated values "5,3,4,2"
        String[] responseArray = responses.split(",");
        double totalScore = 0.0;
        int count = 0;
    
        for (String response : responseArray) {
            try {
                totalScore += Double.parseDouble(response.trim());
                count++;
            } catch (NumberFormatException e) {
                // Ignore invalid values
            }
        }
    
        return count > 0 ? totalScore / count : 0.0; // Calculate average score
    }

    public SurveyResponse submitResponse(Long employeeId, Long surveyId, String responses) {
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(() -> new RuntimeException("Employee not found"));
        Survey survey = surveyRepository.findById(surveyId).orElseThrow(() -> new RuntimeException("Survey not found"));

        // Check if the employee has already submitted a response for this survey
        List<SurveyResponse> existingResponses = responseRepository.findByEmployeeId(employeeId);
        boolean alreadySubmitted = existingResponses.stream()
            .anyMatch(resp -> resp.getSurvey().getId().equals(surveyId));

        if (alreadySubmitted) {
        throw new RuntimeException("You have already submitted this survey.");
        }

        SurveyResponse response = new SurveyResponse();
        response.setEmployee(employee);
        response.setSurvey(survey);
        response.setResponses(responses);
        response.setSubmittedAt(LocalDateTime.now());
        double wellnessScore = calculateWellnessScore(responses); // You need to implement this method
        response.setWellnessScore(wellnessScore);

        return responseRepository.save(response);
    }

    public List<SurveyResponse> getEmployeeResponses(Long employeeId) {
        return responseRepository.findByEmployeeId(employeeId);
    }

    public Optional<SurveyResponse> getResponseById(Long responseId) {
        return responseRepository.findById(responseId);
    }

    public SurveyResponse getSurveyResponseById(Long responseId) {
        return responseRepository.findById(responseId).orElse(null);
    }

    public SurveyResponse updateResponse(Long responseId, String newResponses) {
        SurveyResponse response = responseRepository.findById(responseId)
                .orElseThrow(() -> new RuntimeException("Response not found"));

        // Allow update only within 24 hours
        if (response.getSubmittedAt().plusHours(24).isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Editing time limit exceeded (24 hours).");
        }

        response.setResponses(newResponses.trim());
        response.setLastUpdatedAt(LocalDateTime.now());
        return responseRepository.save(response);
    }

    public String deleteResponse(Long responseId) {

        Optional<SurveyResponse> response = responseRepository.findById(responseId);
        
        if (response.isPresent()) {
            LocalDateTime submittedAt = response.get().getSubmittedAt();
            LocalDateTime now = LocalDateTime.now();
            
            // Check if the response is older than 24 hours
            if (Duration.between(submittedAt, now).toHours() > 24) {
                return "Deletion time limit exceeded (24 hours).";
            }

            responseRepository.deleteById(responseId);
            return "Survey response deleted successfully.";
        } else {
            return "Survey response not found.";
        }

    }    

    //for report 
    public EmployeeWellnessReportDTO getEmployeeWellnessReport(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        List<SurveyResponse> responses = responseRepository.findResponsesByEmployee(employeeId);

        List<SurveyScoreDTO> surveyScores = responses.stream()
        .map(r -> new SurveyScoreDTO(
                r.getSurvey().getTitle(),
                (r.getWellnessScore() != null) ? r.getWellnessScore() : 0.0, // Handle null safely
                r.getSubmittedAt()
        ))
        .collect(Collectors.toList());

        Double overallWellnessScore = surveyScores.stream()
                .mapToDouble(SurveyScoreDTO::getWellnessScore)
                .average()
                .orElse(0.0);

        // Create Employee Wellness Report DTO
        EmployeeWellnessReportDTO report = new EmployeeWellnessReportDTO(
                employee.getId(),
                employee.getName(),
                employee.getDepartment(),
                surveyScores,
                overallWellnessScore
        );

        saveWellnessReport(report);

        return report;
    }

    public void saveWellnessReport(EmployeeWellnessReportDTO reportDto) {
       
        Employee employee = employeeRepository.findById(reportDto.getEmployeeId())
        .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Check if a report for today already exists for this employee
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        Optional<Report> existingReport = reportRepository.findByEmployeeIdAndGeneratedAtAfter(employee.getId(), today);

        if (existingReport.isEmpty()) { // Save only if no report exists for today
            Report report = new Report();
            report.setEmployee(employee);
            report.setOverallWellnessScore(reportDto.getOverallWellnessScore());
            report.setGeneratedAt(LocalDateTime.now());

            reportRepository.save(report);
        }else {
            System.out.println("⚠️ Report already exists for today. Skipping save.");
        }
    
    }
       
}
