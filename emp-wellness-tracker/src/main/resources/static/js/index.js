
    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            window.location.href = "login.html";
        });
    }
    
    if (signupBtn) {
        signupBtn.addEventListener("click", () => {
            window.location.href = "register.html";
        });
    }

