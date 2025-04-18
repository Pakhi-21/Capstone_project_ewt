document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const employeeId = urlParams.get("employeeId");

    if (employeeId) {
        fetchEmployeeReport(employeeId);
    }

    const downloadBtn = document.getElementById("downloadPdfBtn");
    if (downloadBtn) {
    downloadBtn.addEventListener("click", downloadPDF);
    }
});



function fetchEmployeeReport(employeeId) {
    fetch(`http://localhost:8080/api/reports/employee/${employeeId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("employeeId").innerText = data.employeeId;
            document.getElementById("employeeName").innerText = data.employeeName;
            document.getElementById("department").innerText = data.department;
            document.getElementById("overallHealth").innerText = data.overallWellnessScore.toFixed(1);

            setWellnessMessage(data.employeeName, data.overallWellnessScore);

            const tableBody = document.getElementById("reportTableBody");
            tableBody.innerHTML = "";

            data.surveyScores.forEach(survey => {
                const row = document.createElement("tr");
                row.innerHTML = `<td>${survey.surveyTitle}</td><td>${survey.wellnessScore.toFixed(1)}</td>`;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching report:", error));
}

function setWellnessMessage(employeeName, score) {
    let message = "";
    let messageClass = "";

    if (score >= 4.5) {
        message = `${employeeName} is in excellent health! Their overall wellness is outstanding. Encourage them to continue maintaining their healthy lifestyle.`;
        messageClass = "good";
    } else if (score >= 3.5) {
        message = `${employeeName} has a good wellness score. They are doing well but might benefit from small improvements in their health habits.`;
        messageClass = "average";
    } else if (score >= 2.5) {
        message = `${employeeName} has an average wellness score. Their health status needs attention. Consider offering wellness resources for improvement.`;
        messageClass = "warning";
    } else {
        message = `Critical Alert! ${employeeName} has a low wellness score. Their overall health is concerning. Immediate wellness support is recommended.`;
        messageClass = "critical";
    }

    let messageElement = document.getElementById("wellnessMessage");
    messageElement.innerText = message;
    messageElement.className = `message ${messageClass}`;
}


//for pfd genration
function downloadPDF() {
const { jsPDF } = window.jspdf;
const doc = new jsPDF();

// Get employee details
const employeeId = document.getElementById("employeeId").innerText;
const employeeName = document.getElementById("employeeName").innerText;
const department = document.getElementById("department").innerText;
const overallHealth = document.getElementById("overallHealth").innerText;
const wellnessMessage = document.getElementById("wellnessMessage").innerText;

// Set PDF Title (Centered)
doc.setFont("helvetica", "bold");
doc.setFontSize(18);
doc.text("Wellness Report", 105, 20, { align: "center" });

// Employee Details Section
doc.setFontSize(12);
doc.setFont("helvetica", "normal");
doc.text(`Employee ID: ${employeeId}`, 15, 30);
doc.text(`Employee Name: ${employeeName}`, 15, 38);
doc.text(`Department: ${department}`, 15, 46);
doc.text(`Overall Health Score: ${overallHealth} / 5`, 15, 54);

// Wellness Summary Title (Centered)
doc.setFont("helvetica", "bold");
doc.setFontSize(14);
doc.text("Wellness Summary", 105, 65, { align: "center" });

// **Wrap the Wellness Message Correctly**
doc.setFont("helvetica", "normal");
doc.setFontSize(12);
doc.setTextColor(50);

// Split long messages properly so they don't get cut off
const wrappedMessage = doc.splitTextToSize(wellnessMessage, 180);
let messageStartY = 75;
doc.text(wrappedMessage, 15, messageStartY);

doc.setFont("helvetica", "bold");
doc.setFontSize(14);
doc.text("Wellness Records", 105, 95, { align: "center" });


// Extract table data
const tableRows = [];
const tableHeader = ["Survey Title", "Wellness Score"];
document.querySelectorAll("#reportTableBody tr").forEach(row => {
    const cols = row.querySelectorAll("td");
    const rowData = [cols[0].innerText, cols[1].innerText];
    tableRows.push(rowData);
});

// Add Table to PDF (Below the Message)
doc.autoTable({
    startY: 90 + wrappedMessage.length * 5,  // Adjust table position dynamically
    head: [tableHeader],
    body: tableRows,
    theme: "striped",
    styles: { fontSize: 10, halign: "center" },
    headStyles: { fillColor: [0, 123, 255] },
});

// Save PDF
doc.save(`Wellness_Report_${employeeName}.pdf`);
}
