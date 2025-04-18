        // userId stored in session storage
        const userId = sessionStorage.getItem("userId"); 
        const updateProfile= document.getElementById("updateProfile");
        const goToDashboard=document.getElementById("goToDashboard");

        updateProfile.addEventListener("click", updatesProfile);
        
        if(!userId){

            alert("You need to log in first!");
            window.location.href = "login.html";
        }

        //Function to load user profile details from the backend
        async function loadProfile() {
            try {
       
                // Fetch user details from API
                const response = await fetch(`http://localhost:8080/api/employees/${userId}`);
        
                // Check if the response is successful
                if (!response.ok) {
                  throw new Error("Failed to fetch profile data");
                }

                const data = await response.json();

                // Populate the form fields with existing user data
                document.getElementById("name").value = data.name;
                document.getElementById("email").value = data.email;
                document.getElementById("department").value = data.department;
                document.getElementById("location").value = data.location;

             } catch (error) {
                console.error("Error loading profile:", error);
                alert("Failed to load profile. Please try again.");
            }
         }
         
        // Function to update user profile information
        async function updatesProfile() {
            const updatedData = {
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                password: document.getElementById("password").value,
                department: document.getElementById("department").value,
                location: document.getElementById("location").value
            };

            const response = await fetch(`http://localhost:8080/api/employees/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData)
            });

            const result = await response.json();
            alert("Profile updated successfully!");
            window.location.href = "user-dashboard.html";  
        }

        goToDashboard.addEventListener("click", function () {
              window.location.href = "user-dashboard.html";
        });

        loadProfile();