async function loadRates() {
    const res = await fetch("/get_rates");
    const data = await res.json();

    let html = "<form>";
    data.forEach(item => {
        html += `
            <label for="${item.currency}">${item.currency}:</label>
            <input type="number" step="0.01" id="${item.currency}" value="${item.rate}" required><br><br>
        `;
    });
    html += "</form>";

    document.getElementById("currency-form").innerHTML = html;
}

async function submitRates() {
    const inputs = document.querySelectorAll("input[type='number']");
    const updatedRates = {};

    inputs.forEach(input => {
        updatedRates[input.id] = parseFloat(input.value);
    });

    // ✅ Validate all rates are positive numbers
    for (const key in updatedRates) {
        const rate = updatedRates[key];
        if (isNaN(rate) || rate <= 0) {
            alert(`Invalid rate for ${key}. All exchange rates must be positive numbers.`);
            return;
        }
    }

    const res = await fetch("/update_rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRates)
    });

    if (res.ok) {
        alert("Currency rates updated successfully.");
    } else {
        alert("Failed to update rates.");
    }
}

document.addEventListener("DOMContentLoaded", loadRates);
