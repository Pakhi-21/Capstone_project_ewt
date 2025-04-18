const API_BASE_URL = "http://localhost:8080/api/admin/surveys";
        const surveyTableBody = document.getElementById("survey-table-body");
        const surveyForm = document.getElementById("surveyForm");
        const openSurveyForm = document.getElementById("openSurveyForm");
        const logoutbtn=document.getElementById("logout");
       

        document.addEventListener("DOMContentLoaded", fetchSurveys);

        async function fetchSurveys() {
            const response = await fetch(`${API_BASE_URL}/all`);
            const surveys = await response.json();

            surveyTableBody.innerHTML = "";

            surveys.forEach(survey => {
                const startDate = survey.startDate ? new Date(survey.startDate).toLocaleDateString() : "N/A";
                const endDate = survey.endDate ? new Date(survey.endDate).toLocaleDateString() : "N/A";
                const status = survey.status ? "Active" : "Inactive";
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${survey.title}</td>
                    <td>${startDate}</td>
                    <td>${endDate}</td>
                    <td>${status}</td>
                    <td>
                        <button onclick="editSurvey(${survey.id})">Edit</button>
                        <button onclick="deleteSurvey(${survey.id})">Delete</button>
                    </td>
                `;
                surveyTableBody.appendChild(row);
            });
        }

        if (openSurveyForm) {
             openSurveyForm.addEventListener("click", () => {
             window.location.href = "create-survey-form.html";
            });
        } else {
              console.error("Button not found! Check if the ID is correct.");
        }
        
        
        // Deletes a survey by ID
        async function deleteSurvey(id) {
            if (confirm("Are you sure you want to delete this survey?")) {
                try {
                    await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
                    fetchSurveys(); // Refresh the list after deletion
                } catch (error) {
                    console.error("Error deleting survey:", error);
                } 
            }
        }

        
        // Redirects to the edit survey page with the survey ID
        function editSurvey(id) {
            window.location.href = `admin-edit-survey.html?id=${id}`;
        }
        
        logoutbtn.addEventListener("click", () => {
            sessionStorage.clear();
            alert("Logging out...");
            window.location.href = "login.html";
        });