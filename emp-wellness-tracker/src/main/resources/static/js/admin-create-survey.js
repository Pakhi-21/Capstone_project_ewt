        const API_BASE_URL = "http://localhost:8080/api/admin/surveys";
        const addQuestionBtn = document.getElementById("addQuestion");
        const goBackBtn = document.getElementById("goBack");
        const createSurveyForm = document.getElementById("createSurveyForm");
        
        
        goBackBtn.addEventListener("click", function() {
            window.location.href = "admin-survey.html";
        });

         // Add event listener to dynamically add new questions
        addQuestionBtn.addEventListener("click", function() {
            const questionContainer = document.getElementById("questionContainer");
            const newQuestion = document.createElement("input");
            newQuestion.type = "text";
            newQuestion.className = "surveyQuestion";
            newQuestion.placeholder = "Enter question";
            newQuestion.required = true;
            questionContainer.appendChild(newQuestion);
        });


        // Form submission event listener
        createSurveyForm.addEventListener("submit", async function(event) {
            event.preventDefault();

            // Get all questions, join them into a comma-separated string
            const questions = Array.from(document.querySelectorAll(".surveyQuestion"))
                                  .map(input => input.value.trim())
                                  .filter(q => q !== "") 
                                  .join(",");
            
            const surveyData = {
                title: document.getElementById("title").value,
                description: document.getElementById("description").value,
                questions: questions,
                startDate: new Date(document.getElementById("startDate").value).toISOString().split(".")[0],
                endDate: new Date(document.getElementById("endDate").value).toISOString().split(".")[0],      
                status: document.getElementById("status").value === "true"
                
            };
            
            
            try {
                const response = await fetch(API_BASE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(surveyData)
             });

             if (response.ok) {
                 alert("Survey created successfully!");
                 window.location.href = "admin-survey.html"; // Redirect back to Manage Surveys page
             } else {
                 alert("Failed to create survey. Please try again.");
             }
            } catch (error) {
                console.error("Error creating survey:", error);
                alert("An error occurred. Please try again.");
            }
            
        });
        