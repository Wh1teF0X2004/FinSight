// Initialize Chart.js instances
const stockChartCtx = document.getElementById("stock-chart").getContext("2d");
const cryptoChartCtx = document.getElementById("crypto-chart").getContext("2d");
const economicChartCtx = document.getElementById("economic-chart").getContext("2d");

let stockChart, cryptoChart, economicChart;

// Fetch Stock Data
document.getElementById("fetch-stock").addEventListener("click", async () => {
    const tickers = Array.from(document.getElementById("stock-ticker").selectedOptions).map(option => option.value);
    const stockDataDiv = document.getElementById("stock-data");

    try {
        const datasets = [];
        for (const ticker of tickers) {
            const response = await fetch(`/stock/${ticker}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            if (data.error) {
                stockDataDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
                return;
            }

            const stockData = data.chart.result[0].indicators.quote[0];
            const dates = data.chart.result[0].timestamp.map(timestamp => new Date(timestamp * 1000));
            datasets.push({
                label: ticker,
                data: stockData.close.map((value, index) => ({ x: dates[index], y: value })),
                borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
                fill: false
            });
        }

        // Update the stock chart
        if (stockChart) stockChart.destroy();
        stockChart = new Chart(stockChartCtx, {
            type: "line",
            data: { datasets },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: "time",
                        time: {
                            unit: "day",
                            displayFormats: {
                                day: "MMM d, yyyy"
                            }
                        },
                        title: { display: true, text: "Date" }
                    },
                    y: { display: true, title: { display: true, text: "Price (USD)" } }
                },
                plugins: {
                    legend: { display: true } // Show legends
                }
            }
        });
    } catch (error) {
        stockDataDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
});

// Fetch Cryptocurrency Data
document.getElementById("fetch-crypto").addEventListener("click", async () => {
    const coinIds = Array.from(document.getElementById("crypto-ticker").selectedOptions).map(option => option.value);
    const cryptoDataDiv = document.getElementById("crypto-data");

    try {
        const datasets = [];
        for (const coinId of coinIds) {
            const response = await fetch(`/crypto/${coinId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            if (data.error) {
                cryptoDataDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
                return;
            }

            const prices = data.prices.map(price => price[1]);
            const dates = data.prices.map(price => new Date(price[0]));
            datasets.push({
                label: coinId.toUpperCase(),
                data: prices.map((value, index) => ({ x: dates[index], y: value })),
                borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
                fill: false
            });
        }

        // Update the cryptocurrency data display
        cryptoDataDiv.innerHTML = `
            <h3>Cryptocurrency Prices</h3>
            <p>Latest Prices:</p>
            <ul>
                ${datasets.map(dataset => `<li>${dataset.label}: $${dataset.data[dataset.data.length - 1].y}</li>`).join("")}
            </ul>
        `;

        // Update the cryptocurrency chart
        if (cryptoChart) cryptoChart.destroy();
        cryptoChart = new Chart(cryptoChartCtx, {
            type: "line",
            data: { datasets },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: "time",
                        time: {
                            unit: "day",
                            displayFormats: {
                                day: "MMM d, yyyy"
                            }
                        },
                        title: { display: true, text: "Date" }
                    },
                    y: { display: true, title: { display: true, text: "Price (USD)" } }
                },
                plugins: {
                    legend: { display: true } // Show legends
                }
            }
        });
    } catch (error) {
        cryptoDataDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
});

// Fetch Economic Indicators
document.getElementById("fetch-economic").addEventListener("click", async () => {
    const indicators = Array.from(document.getElementById("economic-indicator").selectedOptions).map(option => option.value);
    const economicDataDiv = document.getElementById("economic-data");

    try {
        const datasets = [];
        for (const indicator of indicators) {
            const response = await fetch(`/economic/${indicator}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            if (data.error) {
                economicDataDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
                return;
            }

            const values = data.values;
            const dates = data.dates.map(date => new Date(date));
            datasets.push({
                label: indicator,
                data: values.map((value, index) => ({ x: dates[index], y: value })),
                borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
                fill: false
            });
        }

        // Update the economic data display
        economicDataDiv.innerHTML = `
            <h3>Economic Indicators</h3>
            <p>Latest Values:</p>
            <ul>
                ${datasets.map(dataset => `<li>${dataset.label}: ${dataset.data[dataset.data.length - 1].y}</li>`).join("")}
            </ul>
        `;

        // Update the economic chart
        if (economicChart) economicChart.destroy();
        economicChart = new Chart(economicChartCtx, {
            type: "line",
            data: { datasets },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: "time",
                        time: {
                            unit: "year",
                            displayFormats: {
                                year: "yyyy"
                            }
                        },
                        title: { display: true, text: "Date" }
                    },
                    y: { display: true, title: { display: true, text: "Value" } }
                },
                plugins: {
                    legend: { display: true } // Show legends
                }
            }
        });
    } catch (error) {
        economicDataDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
});