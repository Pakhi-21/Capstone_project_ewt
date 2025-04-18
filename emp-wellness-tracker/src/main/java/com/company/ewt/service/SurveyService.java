package com.company.ewt.service;

import com.company.ewt.entity.Survey;
import com.company.ewt.repository.SurveyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
public class SurveyService {

    @Autowired
    private SurveyRepository surveyRepository;

    // Create a new survey (Admin only)
    public Survey createSurvey(Survey survey) {
        survey.setCreatedAt(LocalDateTime.now());
        survey.setUpdatedAt(LocalDateTime.now());
        return surveyRepository.save(survey);
    }

    // Get all surveys (Admin only)
    public List<Survey> getAllSurveys() {
        return surveyRepository.findAll();
    }

    // Get only active surveys (For employees)
    public List<Survey> getActiveSurveys() {
        return surveyRepository.findByStatusTrue();
    }

    // Get a survey by ID
    public Optional<Survey> getSurveyById(Long id) {
        return surveyRepository.findById(id);
    }

    // Update survey
    public Survey updateSurvey(Long id, Survey updatedSurvey) {
        return surveyRepository.findById(id).map(survey -> {
            survey.setTitle(updatedSurvey.getTitle());
            survey.setQuestions(updatedSurvey.getQuestions());
            survey.setStatus(updatedSurvey.isStatus());
            survey.setStartDate(updatedSurvey.getStartDate());
            survey.setEndDate(updatedSurvey.getEndDate());
            survey.setUpdatedAt(LocalDateTime.now()); 
            return surveyRepository.save(survey);
        }).orElse(null);
    }

    // Delete a survey
    public void deleteSurvey(Long id) {
        surveyRepository.deleteById(id);
    }
   
    
}
