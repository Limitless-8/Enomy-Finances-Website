//HTML will feed information to JavaScript which will then feed the information to the Python Flask backend to update the database
//Asynchronous function allows the code to run in the background and not block the main thread

async function submitApplication() {
    // Correctly reference form element IDs (case-sensitive)
    const name = document.getElementById("Name").value;
    const email = document.getElementById("Email").value;
    const contact = document.getElementById("Phone").value;
    const plan = document.getElementById("Plan").value;

    if (!name || !email || !contact || !plan) {
        alert("Please fill in all fields before submitting.");
        return;
    }

    const data = {
        name: name,
        email: email,
        contact: contact,  // Must match Flask backend key
        plan: plan
    };

    // Exception handling to catch and display errors
    try {
        const response = await fetch("/submit_application", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();

            // ✅ Save data for the summary page
            localStorage.setItem("latestApplication", JSON.stringify(data));

            // ✅ Redirect to summary page
            window.location.href = "summary.html";
        } else {
            const error = await response.json();
            alert("Error submitting application: " + error.message);
        }
    } catch (error) {
        alert("An error occurred while submitting the application. Please try again later.");
        console.error("Submission error:", error);
    }
}
