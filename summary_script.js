document.addEventListener("DOMContentLoaded", function () {
    const userData = JSON.parse(localStorage.getItem("latestApplication"));

    if (!userData) {
        document.getElementById("summary-box").innerHTML = "<p>No application data found.</p>";
        return;
    }

    // Display submitted info
    document.getElementById("sum-name").innerText = userData.name;
    document.getElementById("sum-contact").innerText = userData.contact;
    document.getElementById("sum-email").innerText = userData.email;
    document.getElementById("sum-plan").innerText = formatPlanName(userData.plan);

    // Estimate returns for 5 years using default values
    const lumpSum = 1000;
    const monthly = 100;
    const years = 5;

    let minRate = 0, maxRate = 0;

    if (userData.plan === "basic") {
        minRate = 0.012;
        maxRate = 0.024;
    } else if (userData.plan === "plus") {
        minRate = 0.03;
        maxRate = 0.055;
    } else if (userData.plan === "stocks") {
        minRate = 0.04;
        maxRate = 0.23;
    }

    function calculateInvestment(rate, years) {
        let total = lumpSum;
        const months = years * 12;
        for (let i = 0; i < months; i++) {
            total += monthly;
            total *= (1 + rate / 12);
        }
        return total;
    }

    const min = calculateInvestment(minRate, years).toFixed(2);
    const max = calculateInvestment(maxRate, years).toFixed(2);

    document.getElementById("return-info").innerText =
        `If you invested £${lumpSum} initially and £${monthly}/month for 5 years, 
        your total could grow to between £${min} and £${max} depending on market performance.`;

    function formatPlanName(planCode) {
        switch (planCode) {
            case "basic": return "Basic Savings Plan";
            case "plus": return "Savings Plan Plus";
            case "stocks": return "Managed Stock Investments";
            default: return planCode;
        }
    }
});
