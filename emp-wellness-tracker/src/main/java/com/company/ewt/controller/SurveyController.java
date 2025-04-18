package com.company.ewt.controller;

import com.company.ewt.entity.Survey;
import com.company.ewt.service.SurveyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;



@RestController
@RequestMapping("/api/admin/surveys")
public class SurveyController {
    @Autowired
    private SurveyService surveyService;

    // Create a new survey (Admin)
    @PostMapping
    public ResponseEntity<Survey> createSurvey(@RequestBody Survey survey) {
        return ResponseEntity.ok(surveyService.createSurvey(survey));
    }

    // Get all surveys (Admin)
    @GetMapping("/all")
    public ResponseEntity<List<Survey>> getAllSurveys() {
        return ResponseEntity.ok(surveyService.getAllSurveys());
    }

    // Get only active surveys (Employees)
    @GetMapping("/active")
    public ResponseEntity<List<Survey>> getActiveSurveys() {
        return ResponseEntity.ok(surveyService.getActiveSurveys());
    }

    // Get a specific survey
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Survey>> getSurveyById(@PathVariable Long id) {
        return ResponseEntity.ok(surveyService.getSurveyById(id));
    }

    // Update survey (Admin)
    @PutMapping("/{id}")
    public ResponseEntity<Survey> updateSurvey(@PathVariable Long id, @RequestBody Survey updatedSurvey) {
        Survey survey = surveyService.updateSurvey(id, updatedSurvey);
        if (survey != null) {
            return ResponseEntity.ok(survey);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete survey (Admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSurvey(@PathVariable Long id) {
        surveyService.deleteSurvey(id);
        return ResponseEntity.noContent().build();
    }
}