// Initialize Chart.js instances
const stockChartCtx = document.getElementById("stock-chart").getContext("2d");
const cryptoChartCtx = document.getElementById("crypto-chart").getContext("2d");
const economicChartCtx = document.getElementById("economic-chart").getContext("2d");

let stockChart, cryptoChart, economicChart;

// Fetch Stock Data
document.getElementById("fetch-stock").addEventListener("click", async () => {
    const ticker = document.getElementById("stock-ticker").value;
    const stockDataDiv = document.getElementById("stock-data");

    try {
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
        const dates = data.chart.result[0].timestamp.map(timestamp => new Date(timestamp * 1000).toLocaleDateString());

        // Update the stock data display
        stockDataDiv.innerHTML = `
            <h3>${ticker} Stock Data</h3>
            <p>Open: ${stockData.open[0]}</p>
            <p>Close: ${stockData.close[0]}</p>
            <p>High: ${stockData.high[0]}</p>
            <p>Low: ${stockData.low[0]}</p>
        `;

        // Update the stock chart
        if (stockChart) stockChart.destroy();
        stockChart = new Chart(stockChartCtx, {
            type: "line",
            data: {
                labels: dates,
                datasets: [{
                    label: `${ticker} Price`,
                    data: stockData.close,
                    borderColor: "#007bff",
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { display: true, title: { display: true, text: "Date" } },
                    y: { display: true, title: { display: true, text: "Price (USD)" } }
                }
            }
        });
    } catch (error) {
        stockDataDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
});

// Fetch Cryptocurrency Data
document.getElementById("fetch-crypto").addEventListener("click", async () => {
    const coinId = document.getElementById("crypto-ticker").value;
    const cryptoDataDiv = document.getElementById("crypto-data");

    try {
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
        const dates = data.prices.map(price => new Date(price[0]).toLocaleDateString());

        // Update the cryptocurrency data display
        cryptoDataDiv.innerHTML = `
            <h3>${coinId.toUpperCase()} Price</h3>
            <p>USD: $${prices[prices.length - 1]}</p>
        `;

        // Update the cryptocurrency chart
        if (cryptoChart) cryptoChart.destroy();
        cryptoChart = new Chart(cryptoChartCtx, {
            type: "line",
            data: {
                labels: dates,
                datasets: [{
                    label: `${coinId.toUpperCase()} Price`,
                    data: prices,
                    borderColor: "#28a745",
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { display: true, title: { display: true, text: "Date" } },
                    y: { display: true, title: { display: true, text: "Price (USD)" } }
                }
            }
        });
    } catch (error) {
        cryptoDataDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
});

// Fetch Economic Indicators
document.getElementById("fetch-economic").addEventListener("click", async () => {
    const indicator = document.getElementById("economic-indicator").value;
    const economicDataDiv = document.getElementById("economic-data");

    try {
        const response = await fetch(`/economic/${indicator}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (data.error) {
            economicDataDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
            return;
        }

        // Update the economic data display
        economicDataDiv.innerHTML = `
            <h3>${indicator} Data</h3>
            <p>Latest Value: ${data.values[data.values.length - 1]}</p>
        `;

        // Update the economic chart
        if (economicChart) economicChart.destroy();
        economicChart = new Chart(economicChartCtx, {
            type: "line",
            data: {
                labels: data.dates,
                datasets: [{
                    label: indicator,
                    data: data.values,
                    borderColor: "#dc3545",
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { display: true, title: { display: true, text: "Date" } },
                    y: { display: true, title: { display: true, text: "Value" } }
                }
            }
        });
    } catch (error) {
        economicDataDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
});