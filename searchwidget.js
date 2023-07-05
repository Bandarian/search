// Function to fetch and parse the CSV data
function fetchAndParseCSV() {
  return fetch('https://unloan.sharepoint.com/:x:/r/sites/home/_layouts/15/Doc.aspx?sourcedoc=%7B36fdb5c8-d81b-4068-a97d-4e217303031f%7D&action=default&ct=1688534245009&or=Teams-HL&cid=df704614-9f79-491d-9477-13b7a36177b6')
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

  // Display initial results on page load
  displayResults(parsedData);
});

function displayResults(data) {
  // Clear previous results
  const resultsContainer = document.getElementById('learn-results');
  resultsContainer.innerHTML = '';

  // Display the first three results
  for (let i = 0; i < 3 && i < data.length; i++) {
    const result = data[i];
    createResultItem(result, resultsContainer);
  }
}

function handleSearch(event) {
  const query = event.target.value;
  const searchResults = searchArticles(query, parsedData);

  // Display the search results
  displayResults(searchResults);
}

function createResultItem(result, container) {
  // Create a link for the title
  const titleLink = document.createElement('a');
  titleLink.href = result.URL;
  titleLink.textContent = result.TITLE;
  titleLink.classList.add('search-result-link');

  // Create a result item div and add the "result-item" class
  const resultItem = document.createElement('div');
  resultItem.classList.add('result-item');

  // Create an icon-result div and add it next to the title link
  const iconResult = document.createElement('div');
  iconResult.classList.add('icon-result');

  // Check the TYPE and add the appropriate SVG code as an image element
  if (result.TYPE === "Post") {
    const postImage = document.createElement('img');
    postImage.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
    <svg width="24" height="33" viewBox="0 0 24 33" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2450_6236)">
<path d="M15.0458 17.8552C15.7615 17.0742 16.2184 16.0329 16.2184 14.8844C16.2184 12.4649 14.2539 10.4895 11.8478 10.4895C9.44172 10.4895 7.47725 12.4649 7.47725 14.8844C7.47725 16.1401 8.01025 17.2733 8.86304 18.0695L4.88842 27.5331C4.73614 27.7322 4.64477 27.9619 4.59908 28.2222L3.48741 30.8867C3.16761 31.6677 3.51786 32.5712 4.29451 32.8927C4.49248 32.9693 4.69045 33.0153 4.88842 33.0153C5.48233 33.0153 6.04578 32.6631 6.28944 32.0812L7.17268 29.9986H16.5534C16.6448 29.9986 16.7361 29.9679 16.8275 29.9373L17.726 32.0812C17.9696 32.6631 18.5331 33.0153 19.127 33.0153C19.325 33.0153 19.5229 32.9693 19.7209 32.8927C20.4976 32.5712 20.863 31.6677 20.528 30.8867L15.061 17.8552H15.0458ZM11.8478 13.5521C12.5788 13.5521 13.1727 14.1494 13.1727 14.8844C13.1727 15.6194 12.5788 16.2166 11.8478 16.2166C11.1168 16.2166 10.5229 15.6194 10.5229 14.8844C10.5229 14.1494 11.1168 13.5521 11.8478 13.5521ZM11.8478 19.2793C12.0153 19.2793 12.1676 19.2487 12.3199 19.2334L13.6752 22.4798H10.3097L11.6651 19.264C11.6651 19.264 11.7869 19.2793 11.8478 19.2793ZM8.45187 26.9206L9.03055 25.5424H14.9696L15.5483 26.9206H8.45187Z" fill="#29292B"/>
<path d="M6.33506 11.3624C7.58379 9.49423 9.68531 8.37637 11.9239 8.37637C14.1625 8.37637 16.2488 9.49423 17.5127 11.3624C17.9848 12.0669 18.929 12.2506 19.6295 11.7759C20.33 11.3012 20.5127 10.3518 20.0406 9.64736C18.2132 6.93692 15.1828 5.31372 11.9391 5.31372C8.69546 5.31372 5.64978 6.93692 3.82237 9.64736C3.35029 10.3518 3.53303 11.3012 4.23354 11.7759C4.49242 11.9597 4.79699 12.0362 5.08633 12.0362C5.57364 12.0362 6.06095 11.8065 6.35029 11.3624H6.33506Z" fill="#29292B"/>
<path d="M23.7106 6.12529C20.9847 2.29698 16.5532 0 11.8629 0C7.17251 0 3.10652 2.0826 0.31972 5.71183C-0.198047 6.38561 -0.0762193 7.35035 0.593831 7.85568C1.26388 8.37633 2.20804 8.23851 2.72581 7.58005C4.93393 4.70116 8.25373 3.06264 11.8629 3.06264C15.472 3.06264 19.0811 4.86961 21.2436 7.91694C21.5481 8.33039 22.005 8.56009 22.4771 8.56009C22.7816 8.56009 23.1014 8.46821 23.3603 8.26914C24.0456 7.77912 24.1979 6.81439 23.7106 6.1406V6.12529Z" fill="#29292B"/>
</g>
<defs>
<clipPath id="clip0_2450_6236">
<rect width="24" height="33" fill="white"/>
</clipPath>
</defs>
</svg>

    `);
    postImage.alt = "Post";

    iconResult.appendChild(postImage);
  } else if (result.TYPE === "Article") {
    const articleImage = document.createElement('img');
    articleImage.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
     <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2441_6903)">
<path d="M29.578 7.86248H25.6248C25.5537 7.86248 25.4968 7.89238 25.4257 7.90732V1.49477C25.4257 0.672646 24.7858 0 24.0037 0H1.42202C0.639908 0 0 0.672646 0 1.49477V28.5052C0 29.3274 0.639908 30 1.42202 30H24.0037C25.7385 30 31.0142 30 31.0142 23.438V9.35725C31.0142 8.53513 30.3743 7.86248 29.5922 7.86248H29.578ZM2.84404 2.98954H22.5817V27.0105H2.84404V2.98954ZM28.156 23.423C28.156 25.6951 27.4592 26.6517 25.4115 26.9058V10.8072C25.4115 10.8072 25.5394 10.852 25.6105 10.852H28.1417V23.423H28.156Z" fill="#29292B"/>
<path d="M7.09585 14.4544H18.4293C19.2114 14.4544 19.8514 13.7817 19.8514 12.9596V7.07021C19.8514 6.24809 19.2114 5.57544 18.4293 5.57544H7.09585C6.31374 5.57544 5.67383 6.24809 5.67383 7.07021V12.9596C5.67383 13.7817 6.31374 14.4544 7.09585 14.4544ZM8.51786 8.56498H17.0073V11.4648H8.51786V8.56498Z" fill="#29292B"/>
<path d="M18.984 16.6816H6.38491C5.6028 16.6816 4.96289 17.3543 4.96289 18.1764C4.96289 18.9985 5.6028 19.6712 6.38491 19.6712H18.984C19.7661 19.6712 20.406 18.9985 20.406 18.1764C20.406 17.3543 19.7661 16.6816 18.984 16.6816Z" fill="#29292B"/>
<path d="M18.984 21.5994H6.38491C5.6028 21.5994 4.96289 22.272 4.96289 23.0941C4.96289 23.9163 5.6028 24.5889 6.38491 24.5889H18.984C19.7661 24.5889 20.406 23.9163 20.406 23.0941C20.406 22.272 19.7661 21.5994 18.984 21.5994Z" fill="#29292B"/>
</g>
<defs>
<clipPath id="clip0_2441_6903">
<rect width="31" height="30" fill="white"/>
</clipPath>
</defs>
</svg>

    `);
    articleImage.alt = "Article";

    iconResult.appendChild(articleImage);
  }

  resultItem.appendChild(iconResult);
  resultItem.appendChild(titleLink);

  container.appendChild(resultItem);
}
