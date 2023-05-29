import "./App.css";
import React, { useState, useEffect, Fragment } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";

function App() {
  const [urls, setUrls] = useState([]);
  const [logs, setLogs] = useState("");
  const [urlToScrape, setUrlToScrape] = useState(["", 0]);
  const [busyScrapingDeals, setBusyScrapingDeals] = useState(false);

  const fetchUrls = async () => {
    try {
      const url = process.env.REACT_APP_GET_URLS_TO_SCRAPE + "?scrape_urls=1";
      const urls_ = await axios.get(url);
      setUrls(urls_.data.data);
      return true;
    } catch (error) {
      // console.error(error);
      return false;
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const continiousScraping = async () => {
    if (urls.length !== 0 && !busyScrapingDeals) {
      setBusyScrapingDeals(true);
      var logs_ = "";
      var i = 0;
      for (const url of urls) {
        i++;
        setUrlToScrape([url, i]);
        const serverUrl =
          process.env.REACT_APP_EVOKE_SCRAPE_METHOD + "&the_url=" + url;
        // console.log(serverUrl);
        logs_ += logs + "\n\n>> Scraping: " + url + "\n";
        setLogs(logs_);
        try {
          const response = await axios.get(serverUrl);
          // console.log(response);
          if (response.data.result === true) {
            logs_ +=
              logs +
              ">> Success: " +
              response.data.result +
              " | " +
              response.data.msg +
              "\n";
            setLogs(logs_);
            // console.log("Successfully scraped deal trying again.");
          } else {
            const fetchUrlsAgain = await fetchUrls();
            logs_ +=
              logs +
              ">> Failed: " +
              response.data.result +
              " | " +
              response.data.msg +
              " | Fetching new URLs.\n";
            setLogs(logs_);
            if (fetchUrlsAgain === true) {
              logs_ += logs + ">> Success fetching new URLs.\n";
              setLogs(logs_);
            } else {
              setBusyScrapingDeals(false);
              // console.log("fetchUrls() was false, breaking.");
              logs_ += logs + ">> Failed to fetch new URLs.\n";
              setLogs(logs_);
              break;
            }
          }
        } catch (error) {
          // console.error(error);
          logs_ += "\n\nConnection to server failed\n\n";
          setLogs(logs_);
        }
      }
      // console.log("Logs are being set!");
    }
  };

  return (
    <React.StrictMode>
      <div className="App">
        <header className="App-header">
          {urls.length === 0 && (
            <Fragment>
              <table style={{ maxWidth: "500px" }}>
                <tbody>
                  <tr>
                    <td>
                      <Spinner className={"spinner-1"} animation="grow" />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h4>Fetching URLS to scrape...</h4>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Fragment>
          )}
          {urls.length > 0 && (
            <Fragment>
              {busyScrapingDeals && (
                <Spinner className={"spinner-1"} animation="grow" />
              )}
              <table style={{ maxWidth: "500px" }}>
                <tbody>
                  <tr>
                    <td>
                      <h4>{urls.length} Total URLs To Scrape</h4>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ margin: "0px 40px" }}>
                      {urlToScrape[0].length === 0 ? (
                        <h4>Not scraping.</h4>
                      ) : (
                        <h4>
                          Scraping {urlToScrape[1] + " of " + urls.length}:
                        </h4>
                      )}

                      <h6>{urlToScrape[0]}</h6>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                className={"button-2"}
                style={{
                  opacity: urls.length === 0 || busyScrapingDeals ? 0.5 : 1,
                }}
                onClick={continiousScraping}
              >
                {busyScrapingDeals ? "SCRAPING" : "SCRAPE"}
              </button>

              <textarea
                style={{
                  fontSize: "16px",
                  marginBottom: "20px",
                  width: "80vw",
                  maxWidth: "1000px",
                  marginTop: "40px",
                }}
                rows={15}
                value={"LOGS" + logs}
                onChange={() => {
                  //nothing
                }}
              ></textarea>
            </Fragment>
          )}
        </header>
      </div>
    </React.StrictMode>
  );
}

export default App;
