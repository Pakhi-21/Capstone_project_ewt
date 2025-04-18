
const signin = document.getElementById("signinBtn");

// Add an event listener for  sign-in
signin.addEventListener("click", async () => {
    // Get user input values
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validate input fields
    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    try {
        // Send post request to the backend
        const response = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            alter("Server error. Please try again.");
            return;
        }

        const data = await response.json();

        // Check if login is successful
        if (data.message === "Login successful!") {
            
            // Store user details in session storage
            sessionStorage.setItem("userId", data.userId);
            sessionStorage.setItem("isAdmin", data.isAdmin);

            // Redirect user based on their role
            window.location.href = data.isAdmin ? "admin-dashboard.html" : "user-dashboard.html";
        } else {
            alert("Invalid credentials! Please try again.");
        }
    } catch (error) {
        alert("Something went wrong! Please try again later.");
    }
});
