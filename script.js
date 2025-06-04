const API_KEY = 'YOUR_ALPHA_VANTAGE_API_KEY';

// DOM Elements
const queryInput = document.getElementById('stockQueryInput');
const queryBtn = document.getElementById('stockQueryBtn');
const infoBox = document.getElementById('stockInfoBox');
const graphCanvas = document.getElementById('priceGraphCanvas').getContext('2d');
const dropdown = document.getElementById('trendingStockSelect');
const dropdownBtn = document.getElementById('fetchStockBtn');
const comparisonBody = document.querySelector('#comparisonTable tbody');

let chartInstance = null;

// Utility: Fetch stock time series data
async function fetchDailyStock(symbol) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
    try {
        const res = await fetch(url);
        const json = await res.json();
        return json['Time Series (Daily)'] || null;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

// Utility: Mock top trending stocks
function getMockTrendingStocks() {
    return ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX', 'BABA', 'ADBE'];
}

// Display stock data in info box
function renderStockInfo(symbol, data) {
    const [latest, previous] = Object.keys(data);
    const latestClose = parseFloat(data[latest]['4. close']);
    const previousClose = parseFloat(data[previous]['4. close']);
    const change = (latestClose - previousClose).toFixed(2);
    const volume = data[latest]['5. volume'];

    infoBox.innerHTML = `
        <h3>${symbol}</h3>
        <p>Price: $${latestClose}</p>
        <p>Change: $${change}</p>
        <p>Volume: ${volume}</p>
    `;

    addRowToComparisonTable(symbol, latestClose, change, volume);
}

// Add row to stock comparison table
function addRowToComparisonTable(symbol, price, change, volume) {
    const row = comparisonBody.insertRow();
    row.innerHTML = `
        <td>${symbol}</td>
        <td>$${price}</td>
        <td>${change}</td>
        <td>${volume}</td>
    `;
}

// Render graph using Chart.js
function drawPriceChart(stockData) {
    const labels = Object.keys(stockData).slice(0, 30).reverse();
    const prices = labels.map(date => parseFloat(stockData[date]['4. close']));

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(graphCanvas, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Closing Price',
                data: prices,
                borderColor: '#007bff',
                fill: false,
                tension: 0.2
            }]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Date' } },
                y: { title: { display: true, text: 'Price ($)' }, beginAtZero: false }
            }
        }
    });
}

// Handler: Fetch and display stock by symbol
async function handleStockRequest(symbol) {
    if (!symbol) return;

    const data = await fetchDailyStock(symbol);
    if (data) {
        renderStockInfo(symbol, data);
        drawPriceChart(data);
    } else {
        infoBox.innerHTML = `<p>Unable to fetch data for "${symbol}".</p>`;
    }
}

// Handler: Search button
queryBtn.addEventListener('click', () => {
    const symbol = queryInput.value.trim().toUpperCase();
    handleStockRequest(symbol);
});

// Handler: Dropdown load button
dropdownBtn.addEventListener('click', () => {
    const selectedSymbol = dropdown.value;
    handleStockRequest(selectedSymbol);
});

// Populate dropdown with mock trending symbols
function initializeDropdown() {
    const trending = getMockTrendingStocks();
    trending.forEach(symbol => {
        const opt = document.createElement('option');
        opt.value = symbol;
        opt.textContent = symbol;
        dropdown.appendChild(opt);
    });
}

// Initialize
initializeDropdown();
