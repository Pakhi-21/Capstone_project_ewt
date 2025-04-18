package com.company.ewt.dto;


import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SurveyScoreDTO {
    private String surveyTitle;
    private Double wellnessScore;
    private LocalDateTime submittedAt;
    
    public SurveyScoreDTO(String surveyTitle, Double wellnessScore, LocalDateTime submittedAt) {
        this.surveyTitle = surveyTitle;
        this.wellnessScore = (wellnessScore != null) ? wellnessScore : 0.0;
        this.submittedAt = submittedAt;
    }

    public Double getWellnessScore() {
        return wellnessScore;
    }

}
