# Continuous Scraping App
Continuous Web Scraping with React

# Description
This project aims to address the issue of server timeouts during web scraping by implementing a React app that performs continuous scraping. The app fetches a list of URLs to be scraped from the server, and even if the server times out, the app ensures that the data is still scraped. The scraping process is carried out by making repeated requests to the server, handling success and failure scenarios, and updating the logs accordingly.

##Features
-Fetches a list of URLs to be scraped from the server
-Performs continuous scraping even if the server times out
-Displays the current scraping status, including the URL being scraped
-Handles success and failure scenarios during scraping
-Updates and displays logs of the scraping process

  
![Screenshot of the loading page.](https://github.com/Munya-Marinda/frontend-scraper/assets/84540577/83aeea52-a249-4b6e-9ef6-5cacee53d49b)

![Screenshot of the main page.](https://github.com/Munya-Marinda/frontend-scraper/assets/84540577/9bf1246b-5983-421b-8dd8-99c434b421f7)



## Installation
To run this project locally, follow these steps:

1. Clone the repository:
```
git clone https://github.com/Munya-Marinda/frontend-scraper.git
```

2. Install the dependencies:
```
cd your-repository
npm install
```

3. Set up environment variables:
-Create a .env file in the root directory.
-Define the required environment variables in the format VARIABLE_NAME=value. For example:
```
REACT_APP_GET_URLS_TO_SCRAPE=https://your-server-url/get_urls_to_scrape
REACT_APP_EVOKE_SCRAPE_METHOD=https://your-server-url/evoke_scrape_method
```

4. Start the development server:
```
npm start
```

5. Open your web browser and visit http://localhost:3000 to access the app.

# Usage
Once the app is running, it will fetch the list of URLs to be scraped from the server. The app will continuously scrape the URLs, even if the server times out during the process. The current scraping status, including the URL being scraped, will be displayed on the page. The logs of the scraping process will be updated and shown in the textarea below.

-If the app successfully scrapes a URL, the success message will be logged.
-If the app encounters an error or failure during scraping, the corresponding error message will be logged.
-If the server fails to respond or fetch new URLs, the app will log a connection failure message.

>"Note: The app uses a continuous scraping method to ensure data is scraped even if the server times out. It fetches the URLs to be scraped from the server and performs scraping on each URL sequentially. It handles success and failure scenarios during the scraping process and updates the logs accordingly."

Click the "SCRAPE" button to start the continuous scraping process. The button label changes to "SCRAPING" when the scraping is in progress. The button is disabled when there are no URLs to scrape or when the app is already scraping.


# Contributing
Contributions are welcome! If you find any issues or have suggestions for improvement, please open an issue or submit a pull request in the repository.

# License
This project is licensed under the MIT License.

>"Disclaimer: The information provided in this project's documentation is for demonstration purposes only and does not reflect real functionality."
