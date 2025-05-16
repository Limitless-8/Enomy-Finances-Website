document.addEventListener("DOMContentLoaded", () => {
    fetch("/user_data")
        .then(res => res.json())
        .then(users => {
            const tableBody = document.querySelector("#user-table tbody");

            if (users.length === 0) {
                tableBody.innerHTML = "<tr><td colspan='4'>No users found.</td></tr>";
                return;
            }

            users.forEach(user => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td><button onclick="deleteUser(${user.id})">Delete</button></td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(err => {
            console.error("Error loading user data:", err);
            document.querySelector("#user-table tbody").innerHTML =
                "<tr><td colspan='4'>Failed to load users.</td></tr>";
        });
});

async function deleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
        const response = await fetch(`/delete_user/${userId}`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("User deleted successfully.");
            location.reload();
        } else {
            const error = await response.json();
            alert("Failed to delete user: " + error.message);
        }
    } catch (err) {
        alert("An error occurred while deleting the user.");
        console.error(err);
    }
}
