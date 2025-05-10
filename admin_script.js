document.addEventListener("DOMContentLoaded", function () {
    fetch("/admin_data")
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("admin-table");

            if (data.length === 0) {
                container.innerHTML = "<p>No applications found.</p>";
                return;
            }

            let table = `<table border="1" style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background-color: #00796b; color: white;">
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Contact</th>
                                    <th>Email</th>
                                    <th>Plan</th>
                                </tr>
                            </thead>
                            <tbody>`;

            data.forEach(app => {
                table += `<tr>
                            <td>${app.id}</td>
                            <td>${app.name}</td>
                            <td>${app.contact}</td>
                            <td>${app.email}</td>
                            <td>${app.plan}</td>
                          </tr>`;
            });

            table += "</tbody></table>";
            container.innerHTML = `
            <div class="table-container">
                ${table}
            </div>
        `;
                })
        .catch(err => {
            document.getElementById("admin-table").innerHTML = "<p>Error loading data.</p>";
            console.error("Error fetching admin data:", err);
        });
});
