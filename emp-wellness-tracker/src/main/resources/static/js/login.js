
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

        const data = await response.json();

        // Check if login is successful
        if (response.ok && data.message === "Login successful!") {
            sessionStorage.setItem("userId", data.userId);
            sessionStorage.setItem("isAdmin", data.isAdmin);
            window.location.href = data.isAdmin ? "admin-dashboard.html" : "user-dashboard.html";
        } else {
            alert("Invalid credentials! Please try again.");
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert("Something went wrong! Please try again later.");
    }
});
