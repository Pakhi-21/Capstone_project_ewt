
API_BASE_URL = "http://localhost:8080/api/admin/surveys";
const editSurveyForm = document.getElementById("editSurveyForm");
const cancelEditBtn = document.getElementById("cancelEdit");
        
        
        // Fetch survey details and populate form fields
        document.addEventListener("DOMContentLoaded", async function () {
            const urlParams = new URLSearchParams(window.location.search);
            const surveyId = urlParams.get("id");

            if (!surveyId) {
                alert("Survey ID missing!");
                window.location.href = "admin-survey.html";
                return;
            }

            document.getElementById("surveyId").value = surveyId;

            // Fetch survey details
            const response = await fetch(`${API_BASE_URL}/${surveyId}`);
            if (!response.ok) {
                alert("Failed to fetch survey details");
                return;
            }
            
            const survey = await response.json();

            document.getElementById("title").value = survey.title;
            document.getElementById("description").value = survey.description;

            // Convert date format to 'YYYY-MM-DDTHH:mm'
            document.getElementById("startDate").value = new Date(survey.startDate).toISOString().slice(0, 16);
            document.getElementById("endDate").value = new Date(survey.endDate).toISOString().slice(0, 16);

            document.getElementById("questions").value = survey.questions; // Assuming questions are stored as comma-separated
            document.getElementById("status").value = survey.status.toString();
        });
        
        // Handle form submission and update the survey
        editSurveyForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const surveyId = document.getElementById("surveyId").value;
            const updatedSurvey = {
                title: document.getElementById("title").value,
                description: document.getElementById("description").value,
                startDate: new Date(document.getElementById("startDate").value).toISOString().split(".")[0],
                endDate: new Date(document.getElementById("endDate").value).toISOString().split(".")[0],
                questions: document.getElementById("questions").value,
                status: document.getElementById("status").value === "true"
            };
            
            try {
                const response = await fetch(`${API_BASE_URL}/${surveyId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedSurvey),
              });

              if (response.ok) {
                alert("Survey updated successfully!");
                window.location.href = "admin-survey.html";
              } else {
                alert("Failed to update survey.");
              }
            } catch (error) {
              console.error("Error updating survey:", error);
              alert("An error occurred while updating the survey.");
            }
        });

        // Handle cancel button click (redirect to admin survey page)
        cancelEditBtn.addEventListener("click", function () {
              window.location.href = "admin-survey.html";
        });