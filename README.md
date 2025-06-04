1. Limited API Capabilities (Alpha Vantage)
Problem: Alpha Vantage doesn't provide a direct endpoint to get trending stocks or real-time top gainers/losers.

Solution: Used a mock list of trending stock symbols instead (['AAPL', 'TSLA', etc.]).

Challenge: Can't display actual trending data without a premium or alternative API.

🔄 2. Data Structure Handling
Problem: The API returns a deep nested object like:

![Screenshot (385)](https://github.com/user-attachments/assets/c79da58f-0d16-4860-91a0-2d7bfeeb159c)


js
Copy
Edit
{ "Time Series (Daily)": { "2024-06-03": {...}, ... } }
This structure makes it harder to loop and parse.

Solution: Extracted keys and manually retrieved recent and previous entries.

Challenge: Requires additional checks to avoid errors when data is incomplete.

📉 3. Chart.js Integration
Problem: Chart.js does not automatically update charts.

Solution: Need to manually call chart.destroy() before re-rendering.

Challenge: Forgetting this causes overlapping or corrupted charts.

📱 4. Responsive Design for Smaller Screens
Problem: Managing layout and readability on mobile devices with long stock names and wide tables.

Solution: Used CSS media queries for .search-section.

Challenge: Must carefully test on different screen sizes.

🧪 5. Error Handling for Invalid Symbols
Problem: When the user types a wrong or inactive stock symbol, API might return an empty object or error message.

Solution: Used a fallback error message:

js
Copy
Edit
if (!data) { show "Unable to fetch data..." }
Challenge: API doesn't always return consistent error messages.

🧼 6. Clean UI Updates
Problem: Without clearing old content, duplicate or outdated data may show up.

Solution: Explicitly clear .innerHTML before rendering.

Challenge: Need to manage UI state carefully with dynamic data.

