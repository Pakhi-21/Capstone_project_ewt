const API_BASE_URL = "http://localhost:8080/api";
const userId= sessionStorage.getItem("userId");

document.addEventListener("DOMContentLoaded", fetchSurveyDetails);

async function fetchSurveyDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const surveyId = urlParams.get("surveyId");

    if (!surveyId) {
        alert("Survey ID is missing.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/admin/surveys/${surveyId}`);
        const survey = await response.json();

        document.getElementById("survey-title").textContent = survey.title;
        document.getElementById("survey-description").textContent = survey.description;

        const questionsContainer = document.getElementById("questions-container");
        questionsContainer.innerHTML = "";

        // Convert the questions string into an array
        const questionsArray = survey.questions.split(",");

        questionsArray.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.classList.add("question");

            questionDiv.innerHTML = `
                <label>${question}</label>
                <input type="text" name="answer-${index}" required>
            `;

            questionsContainer.appendChild(questionDiv);
        });

    } catch (error) {
        console.error("Error fetching survey details:", error);
    }
}

document.getElementById("survey-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const surveyId = urlParams.get("surveyId");
    if (!userId) {
        alert("User is not logged in.");
        return;
    }

    const formData = new FormData(event.target);
    const answers = [];

    formData.forEach((value) => {
        answers.push(value);
    });

    console.log(answers);

    const responsePayload = {
        employeeId: userId,
        surveyId: surveyId,
        responses: answers.join(",")  // Convert array to a string
    };

    try {
        const response = await fetch(`${API_BASE_URL}/responses/submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(responsePayload)
        });

        if (response.ok) {
            alert("Survey submitted successfully!");
            window.location.href = "user-dashboard.html";
        } else {
            alert("Error submitting survey.");
        }

    } catch (error) {
        console.error("Error submitting survey:", error);
    }
});