// Add event listener to the login form
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get user input values
    var username = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value.trim();

    // Basic validation for empty fields
    if (username === "" || password === "") {
        alert("Please fill in both fields.");
        return;
    }

    // Check login credentials
    if (username === "admin" && password === "admin") {
        alert("Admin login successful!");
        window.location.href = "admin.html"; // Redirect to admin dashboard
    } else if (username === "user" && password === "user") {
        alert("User login successful!");
        window.location.href = "user_dashboard.html"; // Redirect to new user dashboard
    } else {
        alert("Invalid username or password.");
    }
});
