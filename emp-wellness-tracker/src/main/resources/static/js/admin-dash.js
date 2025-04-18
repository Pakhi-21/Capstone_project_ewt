const API_BASE_URL = "http://localhost:8080/api/admin";
        const cancelBtn = document.getElementById("cancel");
        const addEmployeeForm = document.getElementById("addEmployeeForm");
        const employeeFormContainer=document.getElementById("employeeForm");
        const toggle=document.getElementById("toggle");
        const logoutbtn=document.getElementById("logout");

        // Load employees when the page loads
        document.addEventListener("DOMContentLoaded", fetchEmployees);

        async function fetchEmployees() {
            const response = await fetch(`${API_BASE_URL}/employees`);
            const employees = await response.json();
            console.log("API Response:", employees);
            const tableBody = document.getElementById("employee-table-body");
            tableBody.innerHTML = "";

            employees.forEach(employee => {
                const isAdmin = employee.admin === true || employee.admin === "true"; 
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${employee.name}</td>
                    <td>${employee.email}</td>
                    <td>${employee.department}</td>
                    <td>${employee.location}</td>
                    <td>${isAdmin ? "Admin" : "Employee"}</td>
                    <td>
                        <button onclick="editEmployee(${employee.id}, '${employee.name}', '${employee.email}', '${employee.department}', '${employee.location}')">Edit</button>

                        <button onclick="deleteEmployee(${employee.id})">Delete</button>
                        ${!isAdmin ? `<button id="promote" style="background: #157F7F;" onclick="promoteEmployee(${employee.id})">Promote</button>` : ""}
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }

        addEmployeeForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const employee = {
            name: document.getElementById("empName").value,
            email: document.getElementById("empEmail").value,
            password:document.getElementById("empPass").value,
            department: document.getElementById("empDept").value,
            location: document.getElementById("empLocation").value
        };

        try {
            const response = await fetch(`${API_BASE_URL}/employees`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(employee)
            });
    
            if (!response.ok) throw new Error("Failed to add employee");
    
            employeeFormContainer.style.display = "none";
            await fetchEmployees();
        } catch (error) {
            console.error("Error adding employee:", error);
            alert("Failed to add employee. Please try again.");
        }

         });

        // for edit employee details
        window.editEmployee=function(id,name,email,department,location){
             document.getElementById("editId").value = id;
             document.getElementById("editName").value = name;
             document.getElementById("editEmail").value = email;
             document.getElementById("editDepartment").value = department;
             document.getElementById("editLocation").value = location;
             document.getElementById("editEmployeeForm").style.display='block';
        }     

        // Handle form submission for updating employee
        document.querySelector("#editEmployeeForm form").addEventListener("submit", async (event) => {
            event.preventDefault();

            const id = document.getElementById("editId").value;
            const name = document.getElementById("editName").value;
            const email = document.getElementById("editEmail").value;
            const department = document.getElementById("editDepartment").value;
            const location = document.getElementById("editLocation").value;

            const updatedEmployee = { name, email, department, location };

            const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedEmployee),
            });

            if (response.ok) {
                alert("Employee details updated successfully!");
                document.getElementById("editEmployeeForm").style.display = "none";
                fetchEmployees();
            } else {
                alert("Failed to update employee. Please try again.");
            }
        });

        async function deleteEmployee(id) {
            if (!confirm("Are you sure you want to delete this employee?")) return;
            await fetch(`${API_BASE_URL}/employees/${id}`, { method: "DELETE" });
            fetchEmployees();
        }

        async function promoteEmployee(id) {
            if (!confirm("Are you sure you want to promote this employee to admin?")) return;
            await fetch(`${API_BASE_URL}/employees/${id}/promote`, { method: "PUT" });
            fetchEmployees();
        }


        function openSurveyPage() {
            window.location.href = "admin-survey.html";
        }

        function toggleForm() {
        employeeFormContainer.style.display = employeeFormContainer.style.display === "none" ? "block" : "none";
        }
        toggle.addEventListener("click", toggleForm);

        
        cancelBtn.addEventListener("click", () => {
        document.getElementById("editEmployeeForm").style.display = "none";
        });

        // Logout the user by clearing session storage and redirecting to login page.
         logoutbtn.addEventListener("click", () => {
            sessionStorage.clear();
            alert("Logging out...");
            window.location.href = "login.html";
        });
