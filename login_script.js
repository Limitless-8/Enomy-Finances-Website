// Add event listener to the login form
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Basic validation
    if (!username || !password) {
        alert("Please fill in both fields.");
        return;
    }

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Login successful!");

            // ✅ Set login session in localStorage
            if (username === "admin") {
                localStorage.setItem("loggedInUser", "admin");
                window.location.href = "admin.html";
            } else {
                localStorage.setItem("loggedInUser", "user");
                window.location.href = "user_dashboard.html";
            }
        } else {
            alert(result.message || "Login failed.");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred. Please try again.");
    }
});
