document.addEventListener("DOMContentLoaded", function () {
    fetch("/admin_data")
        .then(res => res.json())
        .then(data => {
            const totalApps = data.length;
            document.getElementById("total-apps").innerText = totalApps;

            const planCounts = { basic: 0, plus: 0, stocks: 0 };
            data.forEach(app => {
                if (app.plan === "basic") planCounts.basic++;
                else if (app.plan === "plus") planCounts.plus++;
                else if (app.plan === "stocks") planCounts.stocks++;
            });

            const counts = [planCounts.basic, planCounts.plus, planCounts.stocks];
            const hasData = counts.some(count => count > 0);

            if (!hasData) {
                document.getElementById("planChart").remove();
                const message = document.createElement("p");
                message.textContent = "No applications yet to show in the chart.";
                message.style.textAlign = "center";
                message.style.color = "#888";
                document.querySelector(".application-form").appendChild(message);
                return;
            }

            const ctx = document.getElementById("planChart").getContext("2d");
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ["Basic Plan", "Savings Plan Plus", "Managed Stocks"],
                    datasets: [{
                        label: "Applications per Plan",
                        data: counts,
                        backgroundColor: ["#4CAF50", "#2196F3", "#FF9800"]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                boxWidth: 20,
                                padding: 15
                            }
                        },
                        title: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            precision: 0,
                            stepSize: 1
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error("Failed to fetch admin data:", error);
            alert("Unable to load analytics data.");
        });
});
