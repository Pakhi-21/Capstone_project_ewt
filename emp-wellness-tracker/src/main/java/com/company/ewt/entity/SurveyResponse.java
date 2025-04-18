package com.company.ewt.entity;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.*;



@Entity
@Getter 
@Setter 
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "survey_reponse")
public class SurveyResponse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    @JsonBackReference
    private Employee employee; 

    @ManyToOne
    @JoinColumn(name = "survey_id", nullable = false)
    private Survey survey;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String responses;  // Store responses as a JSON or comma-separated string

    @Column(nullable = false, updatable = false)
    private LocalDateTime submittedAt;

    @Column(nullable = true)
    private LocalDateTime lastUpdatedAt;

     @Column(name = "wellness_score")
    private Double wellnessScore; // Store computed wellness score

    @PrePersist
    @PreUpdate
    public void updateWellnessScore() {
        this.wellnessScore = calculateWellnessScoreInternal(this.responses);
    }

    private double calculateWellnessScoreInternal(String responses) {
        if (responses == null || responses.trim().isEmpty()) {
            return 0.0; // Return 0 instead of null
        }

        String[] responseArray = responses.split(",");
        double total = 0.0;
        int count = 0;

        for (String response : responseArray) {
            try {
                total += Double.parseDouble(response.trim());
                count++;
            } catch (NumberFormatException e) {
                // Log error if needed
            }
        }

        return count > 0 ? total / count : 0.0; // Return 0.0 instead of null

}

}
