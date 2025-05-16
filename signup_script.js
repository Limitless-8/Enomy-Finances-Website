document.getElementById("signupForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    const userData = {
        username,
        email,
        password
    };

    try {
        const response = await fetch("/register_user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            alert("Account created successfully! You can now log in.");
            window.location.href = "index.html";
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Signup failed:", error);
        alert("An error occurred during sign-up. Please try again.");
    }
});
