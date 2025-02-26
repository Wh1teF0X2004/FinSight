from flask import Flask, render_template, jsonify
import requests

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/stock/<ticker>")
def fetch_stock_data(ticker):
    try:
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{ticker}?interval=1d&range=5d"
        
        # Set a custom User-Agent header
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        
        # Make the request with the custom header
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an error for bad status codes
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

@app.route("/crypto/<coin_id>")
def fetch_crypto_data(coin_id):
    try:
        url = f"https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart?vs_currency=usd&days=30"
        response = requests.get(url)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

@app.route("/economic/<indicator>")
def fetch_economic_data(indicator):
    try:
        # Use Alpha Vantage API to fetch economic data
        api_key = "PQ3DBNMURGBNI0UY"
        if indicator == "GDP":
            url = f"https://www.alphavantage.co/query?function=REAL_GDP&apikey={api_key}"
        elif indicator == "INFLATION":
            url = f"https://www.alphavantage.co/query?function=INFLATION&apikey={api_key}"
        elif indicator == "UNEMPLOYMENT":
            url = f"https://www.alphavantage.co/query?function=UNEMPLOYMENT&apikey={api_key}"
        else:
            return jsonify({"error": "Invalid indicator"}), 400

        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        # Parse the Alpha Vantage response
        if "data" in data:
            dates = [entry["date"] for entry in data["data"]]
            values = [float(entry["value"]) for entry in data["data"]]
            return jsonify({"dates": dates, "values": values})
        else:
            return jsonify({"error": "Invalid API response format"}), 500
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8520)