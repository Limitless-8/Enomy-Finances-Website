document.addEventListener("DOMContentLoaded", function () {
    const questions = document.querySelectorAll(".faq-question");

    questions.forEach(question => {
        question.addEventListener("click", () => {
            const answer = question.nextElementSibling;
            answer.classList.toggle("open");
            question.classList.toggle("active");
        });
    });

    // Handle FAQ question submission
    document.getElementById("faqForm").addEventListener("submit", async function (e) {
        e.preventDefault();
        const email = document.getElementById("faq-email").value;
        const question = document.getElementById("faq-question").value;

        const data = { email, question };

        try {
            const res = await fetch("/submit_faq", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                alert("Thanks! We'll respond to your question shortly.");
                document.getElementById("faqForm").reset();
            } else {
                alert("Error submitting your question. Please try again.");
            }
        } catch (error) {
            console.error("Submission failed:", error);
            alert("An error occurred. Please try again later.");
        }
    });
});
