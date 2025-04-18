package com.company.ewt.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SurveyResponseRequest {
    private Long employeeId;
    private Long surveyId;
    private String responses;
}
