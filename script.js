document.addEventListener("DOMContentLoaded", function () {
    const exchangeRates = {
        "GBP": 1.0,
        "USD": 1.25,
        "EUR": 1.15,
        "BRL": 6.5,
        "JPY": 150.0,
        "TRY": 35.0
    };

    // --- Currency Converter ---
    const convertButton = document.getElementById("convert");
    if (convertButton) {
        convertButton.addEventListener("click", function () {
            const amountInput = document.getElementById("amount").value;
            const amount = parseFloat(amountInput);
            const from = document.getElementById("from").value;
            const to = document.getElementById("to").value;
            const resultBox = document.getElementById("conversion-result");

            // Added validation for non-numeric and out-of-range input
            if (isNaN(amount) || amount < 300 || amount > 5000) {
                alert("Please enter a valid amount between 300 and 5000.");
                return;
            }

            const rawConverted = (amount / exchangeRates[from]) * exchangeRates[to];

            // Determine fee %
            let feePercent = 0.035; // default for ≤ 500
            if (amount > 2500) {
                feePercent = 0.015;
            } else if (amount > 1500) {
                feePercent = 0.02;
            } else if (amount > 500) {
                feePercent = 0.027;
            }

            // Fee in USD
            const feeInUSD = (amount / exchangeRates[from]) * exchangeRates["USD"] * feePercent;

            // Final amount after subtracting fee
            const finalAmount = rawConverted - feeInUSD;

            resultBox.innerHTML = `
                <strong>Converted Amount:</strong> $${rawConverted.toFixed(2)}<br>
                <strong>Transaction Fee (${(feePercent * 100).toFixed(1)}%):</strong> $${feeInUSD.toFixed(2)}<br>
                <strong>Final Amount After Fee:</strong> $${finalAmount.toFixed(2)}
            `;
        });
    }

    // --- Investment Calculator ---
    const calcButton = document.getElementById("calculate-returns");
    if (calcButton) {
        calcButton.addEventListener("click", function () {
            const initial = parseFloat(document.getElementById("investment-amount").value);
            const monthly = parseFloat(document.getElementById("monthly").value);
            const plan = document.getElementById("investment-plan").value;
            const resultBox = document.getElementById("investment-result");

            if (isNaN(initial) || isNaN(monthly) || !plan) {
                resultBox.textContent = "Please fill all the missing fields.";
                return;
            }

            // Validate plan rules
            if (plan === "basic") {
                if (monthly < 50) {
                    resultBox.textContent = "Basic Plan requires a minimum monthly investment of £50.";
                    return;
                }
                if ((initial + monthly * 12) > 20000) {
                    resultBox.textContent = "Total yearly investment exceeds £20,000 limit for Basic Plan.";
                    return;
                }
            }

            if (plan === "plus") {
                if (monthly < 50 || initial < 300) {
                    resultBox.textContent = "Savings Plan Plus requires min. monthly: £50 and initial: £300.";
                    return;
                }
                if ((initial + monthly * 12) > 30000) {
                    resultBox.textContent = "Total yearly investment exceeds £30,000 limit for Savings Plan Plus.";
                    return;
                }
            }

            if (plan === "stocks") {
                if (monthly < 150 || initial < 1000) {
                    resultBox.textContent = "Managed Stocks requires min. monthly: £150 and initial: £1000.";
                    return;
                }
                // No max limit
            }

            let minRate = 0, maxRate = 0, feeRate = 0;
            if (plan === "basic") {
                minRate = 0.012; maxRate = 0.024; feeRate = 0.0025;
            } else if (plan === "plus") {
                minRate = 0.03; maxRate = 0.055; feeRate = 0.003;
            } else if (plan === "stocks") {
                minRate = 0.04; maxRate = 0.23; feeRate = 0.013;
            }

            function calculateInvestment(rate, years) {
                const months = years * 12;
                let total = initial;

                for (let i = 0; i < months; i++) {
                    total += monthly;
                    total *= (1 + rate / 12);
                }

                const fees = monthly * months * feeRate;
                total -= fees;

                const profit = total - initial - (monthly * months);
                let tax = 0;

                if (plan === "stocks") {
                    if (profit > 40000) {
                        tax = ((profit - 40000) * 0.2) + (28000 * 0.1);
                    } else if (profit > 12000) {
                        tax = (profit - 12000) * 0.1;
                    }
                } else if (plan === "plus" && profit > 12000) {
                    tax = (profit - 12000) * 0.1;
                }

                total -= tax;
                return { total, profit, fees, tax };
            }

            const timeFrames = [1, 5, 10];
            let results = "";

            timeFrames.forEach(years => {
                const min = calculateInvestment(minRate, years);
                const max = calculateInvestment(maxRate, years);

                results += `
                    <div class="investment-block">
                        <h3>${years}-Year Investment</h3>
                        <ul>
                            <li><strong>Max Value:</strong> £${max.total.toFixed(2)}</li>
                            <li><strong>Min Value:</strong> £${min.total.toFixed(2)}</li>
                            <li><strong>Max Profit:</strong> £${max.profit.toFixed(2)}</li>
                            <li><strong>Max Fee:</strong> £${max.fees.toFixed(2)}</li>
                            <li><strong>Max Tax:</strong> £${max.tax.toFixed(2)}</li>
                        </ul>
                    </div>
                `;
            });

            resultBox.innerHTML = results;
        });
    }
});
