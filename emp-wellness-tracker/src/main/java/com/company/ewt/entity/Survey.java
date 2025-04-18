package com.company.ewt.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;



import lombok.*;

@Entity
@Table(name = "surveys")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Survey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    
    //store question as JSON string or comma-separated values
    @Column(columnDefinition = "TEXT", nullable = false)
    private String questions;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private boolean status; // Active surveys only should be visible


}
