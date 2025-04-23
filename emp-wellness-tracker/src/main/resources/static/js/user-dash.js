//API Base URL
const API_BASE_URL = "http://localhost:8080/api";

const logoutBtn=document.getElementById("logout");
const userId = sessionStorage.getItem("userId");

    // load active or past survey 
    document.addEventListener("DOMContentLoaded", () => {
         if (!userId) {
        alert("User not found. Please login again.");
        window.location.href = "login.html";
        return;
    }
        fetchUserName();
        fetchActiveSurveys();
        fetchPastSurveys();
        setupResponsiveNav();
    });

    
    // Function to fetch user data and display name
    async function fetchUserName() {
        try {
            const response = await fetch(`${API_BASE_URL}/employees/${userId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            
            const userData = await response.json();
            
            // Update the welcome banner with the user's name
            document.getElementById("user-name").textContent = userData.name || "User";
            
        } catch (error) {
            console.error('Error fetching user data:', error);
            // Fallback to "User" if there's an error
            document.getElementById("user-name").textContent = "User";
        }
    }

    
    // Set up responsive navigation for mobile devices
    function setupResponsiveNav() {
        const menuToggle = document.getElementById("menu-toggle");
        const sidebar = document.querySelector(".sidebar");
        const content = document.querySelector(".content");
        
        // Only add event listeners if menu toggle exists
        if (menuToggle) {

            // Toggle sidebar when menu button is clicked
            menuToggle.addEventListener("click", function(e) {
                e.stopPropagation();
                sidebar.classList.toggle("active");
                content.classList.toggle("shifted");
            });
            
            // Close sidebar when clicking outside
            document.addEventListener("click", function(e) {
                if (!sidebar.contains(e.target) && e.target !== menuToggle && window.innerWidth <= 768) {
                    sidebar.classList.remove("active");
                    content.classList.remove("shifted");
                }
            });
            
            // Handle window resize events
            window.addEventListener("resize", function() {
                if (window.innerWidth > 768) {
                    sidebar.classList.remove("active");
                    content.classList.remove("shifted");
                }
            });
        }
    }
        
    //Fetch and display active surveys.  
    async function fetchActiveSurveys() {
         try {
               const response = await fetch(`${API_BASE_URL}/admin/surveys/active`);
               let surveys = await response.json();

               const pastResponse = await fetch(`${API_BASE_URL}/responses/employee/${userId}`);
               const pastSurveys = await pastResponse.json();

               // Get survey IDs that the user has already submitted
               const submittedSurveyIds = new Set(pastSurveys.map(survey => survey.survey.id));
               
               // Filter active surveys to remove already submitted ones
               surveys = surveys.filter(survey => !submittedSurveyIds.has(survey.id))

               const surveyContainer = document.getElementById("survey-container");
               surveyContainer.innerHTML = ""; 

               if (surveys.length === 0) {
                surveyContainer.innerHTML = `<h3 class="no-surveys">No active surveys available at the moment. Please check later.</h3>`;
                return;
               }

               surveys.forEach(survey => {
               const surveyCard = document.createElement("div");
               surveyCard.classList.add("survey-card");

               surveyCard.innerHTML = `
                  <h3>${survey.title}</h3>
                  <button onclick="fillSurvey(${survey.id})">Fill Survey</button>
                `;

               surveyContainer.appendChild(surveyCard);
            });

            } catch (error) {
                console.error("Error fetching active surveys:", error);
           }
         } 

    function fillSurvey(surveyId) {
          window.location.href = `fill-survey.html?surveyId=${surveyId}`;
    }
    
    // fetch  past surveys
    async function fetchPastSurveys() {
           
            try {
                const response = await fetch(`${API_BASE_URL}/responses/employee/${userId}`);
                const pastSurveys = await response.json();

                const pastSurveyContainer = document.getElementById("past-survey-container");
                pastSurveyContainer.innerHTML = ""; 

                pastSurveys.forEach(survey => {
                    const surveyCard = document.createElement("div");
                    surveyCard.classList.add("survey-card");

                    surveyCard.innerHTML = `
                        <h3>${survey.survey.title}</h3>
                        <p><strong>Submitted On:</strong> ${new Date(survey.submittedAt).toLocaleDateString()}</p>
                        <button onclick="editSurvey(${survey.id})">✏️ Edit</button>
                        <button onclick="deleteSurvey(${survey.id})" class="delete-btn">🗑️ Delete</button>
                    `;

                    pastSurveyContainer.appendChild(surveyCard);
                });

            } catch (error) {
                console.error("Error fetching past surveys:", error);
            }
    }
        
    //check if the user can edit thesurvey
    async function editSurvey(responseId) {
            try {
             const response = await fetch(`${API_BASE_URL}/responses/check/${responseId}`);
             const result = await response.json();

            if (result.editable === false) {
                alert("❌ You cannot edit this survey as the 24-hour limit has passed.");
            } else {
                window.location.href = `edit-survey.html?responseId=${responseId}`;
            }
             
           } catch (error) {
             console.error("Error while checking edit permission:", error);
            }
            
        }

        
    //delete the past survey response
    async function deleteSurvey(responseId) {
            try {
            const response = await fetch(`http://localhost:8080/api/responses/${responseId}`, {
                method: 'DELETE',
            });

            const message = await response.text();

            if (response.ok) {
                alert(message);  
                location.reload();  
            } else {
                alert(message);
            }

           } catch (error) {
            console.error("Error deleting response:", error);
            alert("Failed to delete the survey response.");
          }
    }  
        
        // Logout the user by clearing session storage and redirecting to login page.
        logoutBtn.addEventListener("click", () => {
            sessionStorage.clear();
            alert("Logging out...");
            window.location.href = "login.html";
        });