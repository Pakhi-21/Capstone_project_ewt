const API_BASE_URL = "http://localhost:8080/api";
const userId = sessionStorage.getItem("userId");
let surveySpecificId;
document.addEventListener("DOMContentLoaded", fetchSurveyResponse);

async function fetchSurveyResponse() {
    const urlParams = new URLSearchParams(window.location.search);
    const responseId = urlParams.get("responseId");

    if (!responseId) {
        alert("Response ID is missing.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/responses/${responseId}`);
        const responseData = await response.json();

        // Extracting survey and response details
        const survey = responseData.survey;
        surveySpecificId=responseData.survey.id
        const submittedResponses = responseData.responses.split(",");

        document.getElementById("survey-title").textContent = survey.title;
        document.getElementById("survey-description").textContent = survey.description;

        const questionsContainer = document.getElementById("questions-container");
        questionsContainer.innerHTML = "";

        const questionsArray = survey.questions.split(",");

        questionsArray.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.classList.add("question");

            questionDiv.innerHTML = `
                <label>${question}</label>
                <input type="text" name="answer-${index}" value="${submittedResponses[index]}" required>
            `;

            questionsContainer.appendChild(questionDiv);
        });

    } catch (error) {
        console.error("Error fetching survey response:", error);
    }
}

document.getElementById("survey-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const responseId = urlParams.get("responseId");

    if (!responseId) {
        alert("Response ID is missing.");
        return;
    }

    const formData = new FormData(event.target);
    const updatedAnswers = [];

    formData.forEach((value) => {
        updatedAnswers.push(value);
    });

    const updatePayload = {
        employeeId: Number(userId),
        surveyId: surveySpecificId, 
        responses: updatedAnswers.map(answer => answer.trim()).join(",")  // Convert array to string
    };

    console.log("Updated Payload: ", JSON.stringify(updatePayload));


    try {
        const response = await fetch(`${API_BASE_URL}/responses/${responseId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatePayload)
        });

        if (response.ok) {
            alert("Survey response updated successfully!");
            window.location.href = "user-dashboard.html";
        } else {
            alert("You cannot edit this survey as the 24-hour limit has passed.");
        }

    } catch (error) {
        console.error("Error updating survey response:", error);
    }
});