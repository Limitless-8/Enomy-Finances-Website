function recommendPlan() {
    const lump = parseFloat(document.getElementById("lump").value);
    const monthly = parseFloat(document.getElementById("monthly").value);
    const risk = document.getElementById("risk").value;
    const duration = parseInt(document.getElementById("duration").value);

    if (isNaN(lump) || isNaN(monthly) || !risk || isNaN(duration)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    let plan = "";
    let reason = "";

    if (risk === "low") {
        if (monthly >= 50 && lump < 300) {
            plan = "Basic Savings Plan";
            reason = "You prefer low risk and meet the minimum monthly investment.";
        } else if (lump >= 300 && monthly >= 50) {
            plan = "Savings Plan Plus";
            reason = "You prefer low risk and qualify for a higher return with a safe profile.";
        } else {
            plan = "Basic Savings Plan";
            reason = "Your inputs fit best with a low-risk, simple investment model.";
        }
    }

    else if (risk === "medium") {
        if (lump >= 300 && monthly >= 50 && duration >= 3) {
            plan = "Savings Plan Plus";
            reason = "Your contributions and time horizon suit a mid-risk plan with better returns.";
        } else {
            plan = "Basic Savings Plan";
            reason = "A more conservative plan is better given your contribution and duration.";
        }
    }

    else if (risk === "high") {
        if (lump >= 1000 && monthly >= 150 && duration >= 5) {
            plan = "Managed Stock Investments";
            reason = "You meet all high-risk criteria for long-term stock growth potential.";
        } else if (lump >= 300 && monthly >= 50) {
            plan = "Savings Plan Plus";
            reason = "You don't fully meet the stock criteria, but your profile suits a mid-risk option.";
        } else {
            plan = "Basic Savings Plan";
            reason = "You prefer high risk, but current contributions are too low for advanced plans.";
        }
    }

    const resultDiv = document.getElementById("recommendation-result");
    resultDiv.innerHTML = `
        <strong>Recommended Plan:</strong> ${plan}<br>
        <em>Reason:</em> ${reason}
    `;
}
