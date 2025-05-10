document.addEventListener("DOMContentLoaded", () => {
    const simulateBtn = document.getElementById("simulate");
    const ctx = document.getElementById("performanceChart").getContext("2d");
    const errorBox = document.getElementById("sim-error");
    let chart;

    simulateBtn.addEventListener("click", () => {
        const initial = parseFloat(document.getElementById("sim-initial").value);
        const monthly = parseFloat(document.getElementById("sim-monthly").value);
        const plan = document.getElementById("sim-plan").value;
        const years = parseInt(document.getElementById("sim-duration").value, 10);
        errorBox.textContent = "";

        if (isNaN(initial) || isNaN(monthly) || !plan || isNaN(years)) {
            errorBox.textContent = "Please fill in all fields correctly.";
            return;
        }

        const yearlyTotal = initial + (monthly * 12);

        if (plan === "basic") {
            if (monthly < 50) {
                errorBox.textContent = "Basic Plan: Monthly investment must be at least £50.";
                return;
            }
            if (yearlyTotal > 20000) {
                errorBox.textContent = "Basic Plan: Combined yearly investment (initial + monthly) must not exceed £20,000.";
                return;
            }
        }

        if (plan === "plus") {
            if (initial < 300 && monthly < 50) {
                errorBox.textContent = "Savings Plan Plus: Initial investment must be at least £300 and monthly at least £50.";
                return;
            }
            if (initial < 300) {
                errorBox.textContent = "Savings Plan Plus: Initial investment must be at least £300.";
                return;
            }
            if (monthly < 50) {
                errorBox.textContent = "Savings Plan Plus: Monthly investment must be at least £50.";
                return;
            }
            if (yearlyTotal > 30000) {
                errorBox.textContent = "Savings Plan Plus: Combined yearly investment must not exceed £30,000.";
                return;
            }
        }

        if (plan === "stocks") {
            if (initial < 1000 && monthly < 150) {
                errorBox.textContent = "Managed Stocks: Initial investment must be at least £1,000 and monthly at least £150.";
                return;
            }
            if (initial < 1000) {
                errorBox.textContent = "Managed Stocks: Initial investment must be at least £1,000.";
                return;
            }
            if (monthly < 150) {
                errorBox.textContent = "Managed Stocks: Monthly investment must be at least £150.";
                return;
            }
        }

        // Rates per plan
        let minRate, maxRate;
        if (plan === "basic")       { minRate = 0.012;  maxRate = 0.024; }
        else if (plan === "plus")   { minRate = 0.03;   maxRate = 0.055; }
        else if (plan === "stocks") { minRate = 0.04;   maxRate = 0.23;  }

        function project(rate) {
            const data = [];
            let total = initial;
            const months = years * 12;
            let totalFees = 0;
            let totalProfit = 0;
            let tax = 0;

            let feeRate = 0;
            if (plan === "basic") feeRate = 0.0025;
            else if (plan === "plus") feeRate = 0.003;
            else if (plan === "stocks") feeRate = 0.013;

            for (let y = 1; y <= years; y++) {
                for (let m = 0; m < 12; m++) {
                    total += monthly;
                    total *= (1 + rate / 12);
                }
                const yearlyFees = monthly * 12 * feeRate;
                total -= yearlyFees;
                totalFees += yearlyFees;
                data.push(total);
            }

            const rawInvestment = initial + (monthly * months);
            totalProfit = total - rawInvestment;

            if (plan === "plus" && totalProfit > 12000) {
                tax = (totalProfit - 12000) * 0.1;
            }
            if (plan === "stocks") {
                if (totalProfit > 40000) {
                    tax = ((totalProfit - 40000) * 0.2) + (28000 * 0.1);
                } else if (totalProfit > 12000) {
                    tax = (totalProfit - 12000) * 0.1;
                }
            }

            total -= tax;

            return {
                yearlyTotals: data,
                final: total,
                fees: totalFees,
                tax: tax
            };
        }

        const minProjection = project(minRate);
        const maxProjection = project(maxRate);

        const labels = Array.from({ length: years }, (_, i) => `${i + 1}y`);
        const minData = minProjection.yearlyTotals;
        const maxData = maxProjection.yearlyTotals;

        if (chart) chart.destroy();

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: `Min Projection (${(minRate * 100).toFixed(1)}% p.a.)`,
                        data: minData,
                        borderColor: 'blue',
                        backgroundColor: 'rgba(0, 123, 255, 0.2)',
                        fill: false,
                    },
                    {
                        label: `Max Projection (${(maxRate * 100).toFixed(1)}% p.a.)`,
                        data: maxData,
                        borderColor: 'red',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: false,
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: {
                        display: true,
                        text: 'Projected Investment Growth Over Time'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: value => '£' + value.toFixed(0)
                        }
                    }
                }
            }
        });

        document.getElementById("projection-summary").innerHTML = `
            <p><strong>Min Plan – Final: £${minProjection.final.toFixed(2)}</strong><br>
               Tax: £${minProjection.tax.toFixed(2)} | Fees: £${minProjection.fees.toFixed(2)}</p>
            <p><strong>Max Plan – Final: £${maxProjection.final.toFixed(2)}</strong><br>
               Tax: £${maxProjection.tax.toFixed(2)} | Fees: £${maxProjection.fees.toFixed(2)}</p>
        `;
    });
});
