const signup = document.getElementById("signupBtn");

// Function to handle user registration
signup.addEventListener("click", async () => {
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const department = document.getElementById("department").value.trim();
            const location = document.getElementById("location").value.trim();
                    
             // Regular expressions
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;


            if (!name || !email || !password || !department || !location) {
                alert("Please fill in all fields.");
                return;
            }

            // Validate email format
            if (!emailRegex.test(email)) {
                alert("Please enter a valid email address.");
                return;
            }

            // Validate password strength
            if (!passwordRegex.test(password)) {
                alert("Password must be at least 8 characters long and include at least one letter, one number, and one special character.");
                return;
            }

            console.log(JSON.stringify({ name, email, password, department, location }));

            try {
                const response = await fetch("http://localhost:8080/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password, department, location })
                });

                const data = await response.json();
                alert(data.message);
                window.location.href = "login.html"; 
            } catch (error) {
                alert("Something went wrong! Please try again later.");
            }
        });