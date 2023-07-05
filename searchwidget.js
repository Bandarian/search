  // Function to fetch and parse the CSV data
  function fetchAndParseCSV() {
    return fetch('path/to/your/csv/file.csv')
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
      const titleLowerCase = item.Title.toLowerCase();

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
  });

  function handleSearch(event) {
    const query = event.target.value;
    const searchResults = searchArticles(query, parsedData);

    // Clear previous results
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    // Display top three matching results
    for (let i = 0; i < 3 && i < searchResults.length; i++) {
      const result = searchResults[i];

      const resultElement = document.createElement('div');
      resultElement.classList.add('search-result');

      // Determine the icon based on the type
      const iconClass = determineIconClass(result.Type);
      const iconElement = document.createElement('div');
      iconElement.classList.add('search-result-icon', iconClass);
      resultElement.appendChild(iconElement);

      // Create a link for the title
      const titleLink = document.createElement('a');
      titleLink.href = result.Link;
      titleLink.textContent = result.Title;
      resultElement.appendChild(titleLink);

      resultsContainer.appendChild(resultElement);
    }
  }

  // Function to determine the icon class based on the type
  function determineIconClass(type) {
    if (type === 'Article') {
      return 'article-icon';
    } else if (type === 'Post') {
      return 'post-icon';
    } else if (type === 'News') {
      return 'news-icon';
    }

    return '';
  }
