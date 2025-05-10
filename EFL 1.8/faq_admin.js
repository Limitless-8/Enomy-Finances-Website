document.addEventListener("DOMContentLoaded", () => {
    fetch("/faq_data")
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                document.getElementById("faq-table").innerHTML = "<p>No questions submitted yet.</p>";
                return;
            }

            let html = "<table><thead><tr><th>ID</th><th>Email</th><th>Question</th></tr></thead><tbody>";

            data.forEach(q => {
                html += `<tr>
                            <td>${q.id}</td>
                            <td>${q.email}</td>
                            <td>${q.question}</td>
                         </tr>`;
            });

            html += "</tbody></table>";
            document.getElementById("faq-table").innerHTML = html;
        })
        .catch(err => {
            console.error("Error loading FAQ data:", err);
            document.getElementById("faq-table").innerHTML = "<p>Failed to load questions.</p>";
        });
});
