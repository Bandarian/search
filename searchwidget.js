// Function to fetch and parse the CSV data
function fetchAndParseCSV() {
  return fetch('https://uploads-ssl.webflow.com/6213e151e80699c74710709e/64a50692754d001d8b6c9c7c_Untitled%20spreadsheet%20-%20Sheet1.csv')
    .then(response => response.text())
    .then(csvData => {
      // Parse the CSV data
      return parseCSV(csvData);
    });
}

// Function to parse the CSV data into an array of objects
function parseCSV(csvData) {
  const lines = csvData.split('\n');
  const headers = lines[0].split(',');
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(',');
    if (currentLine.length !== headers.length) {
      continue; // Skip invalid lines
    }

    const item = {};
    for (let j = 0; j < headers.length; j++) {
      item[headers[j].trim()] = currentLine[j].trim();
    }

    result.push(item);
  }

  return result;
}

// Function to perform search based on query
function searchArticles(query, data) {
  const results = [];
  const queryLowerCase = query.toLowerCase();

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const titleLowerCase = item.TITLE.toLowerCase();

    if (titleLowerCase.includes(queryLowerCase)) {
      results.push(item);
    }
  }

  return results;
}

// Attach event listener to the search input
const searchBar = document.getElementById('searchBar');
searchBar.addEventListener('input', handleSearch);

// Global variable to store the parsed CSV data
let parsedData = [];

// Fetch and parse the CSV data when the page loads
fetchAndParseCSV().then(data => {
  parsedData = data;
  console.log(parsedData); // Log the parsed data to the console
});

function handleSearch(event) {
  const query = event.target.value;
  const searchResults = searchArticles(query, parsedData);

  // Clear previous results
  const resultsContainer = document.getElementById('learn-results');
  resultsContainer.innerHTML = '';

  // Display top three matching results
  for (let i = 0; i < 3 && i < searchResults.length; i++) {
    const result = searchResults[i];

    // Create a link for the title
    const titleLink = document.createElement('a');
    titleLink.href = result.URL;
    titleLink.textContent = result.TITLE;
    titleLink.classList.add('search-result-link');

    // Create a result item div and add the "result-item" class
    const resultItem = document.createElement('div');
    resultItem.classList.add('result-item');
    resultItem.appendChild(titleLink);

     // Check if the TYPE matches an element ID and show the corresponding element
     const type = result.TYPE;
     const matchingElement = document.getElementById(type);
     if (matchingElement) {
     matchingElement.style.display = 'block'; // Or any other display style you desire
  }

    resultsContainer.appendChild(resultItem);
  }
}
