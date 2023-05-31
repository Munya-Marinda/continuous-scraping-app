import "./App.css";
import React, { useState, useEffect, useCallback, Fragment } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";

function App() {
  const [logs, setLogs] = useState("");
  //
  const [urls, setUrls] = useState(false);
  const [urlToScrape, setUrlToScrape] = useState(["", 0]);
  const [busyScrapingDeals, setBusyScrapingDeals] = useState(false);
  //
  const [imagesToDownload, setImagesToDownload] = useState([]);
  const [busyScrapingImages, setBusyScrapingImages] = useState(false);
  //
  const [totolScrapedStats, setTotolScrapedStats] = useState({
    totalLive: "null",
    totalDead: "null",
  });
  const [busyCheckingDeadUrls, setBusyCheckingDeadUrls] = useState(false);
  //

  const fetchUrls = useCallback(async () => {
    fetchImagesToDownload();
    try {
      const url = process.env.REACT_APP_GET_URLS_TO_SCRAPE + "?scrape_urls=1";
      const urls_ = await axios.get(url);
      if (typeof urls_.data !== "string") {
        setUrls(urls_.data.data);
        console.error(urls_.data.data);
        return true;
      } else {
        console.log("Error fetching logs.");
        return false;
      }
    } catch (error) {
      // console.error(error);
      return false;
    }
  }, []);

  const fetchImagesToDownload = useCallback(async () => {
    try {
      const url = process.env.REACT_APP_GET_IMAGES_TO_DOWNLOAD;
      const images_ = await axios.get(url);
      if (typeof images_.data === "object") {
        setImagesToDownload(images_.data);
        return true;
      } else {
        console.log("Error fetching images to download.");
        // console.error(images_.data.data);
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const url = process.env.REACT_APP_GET_STATS;
      const response = await axios.get(url);
      if (typeof response.data === "object") {
        setTotolScrapedStats(response.data.data);
        console.log(response.data.data);
      } else {
        console.log("Error fetching images to download.");
      }
    } catch (error) {
      console.error(error);
      return false;
    }
    fetchStats();
  }, []);

  useEffect(() => {
    fetchUrls();
    fetchImagesToDownload();
    fetchStats();
  }, [fetchUrls, fetchImagesToDownload, fetchStats]);

  const continiousScrapingDeals = async () => {
    if (urls?.length !== 0 && !busyScrapingDeals) {
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

  const continiousScrapingImages = async () => {
    fetchImagesToDownload();
    if (imagesToDownload.length > 0 && !busyScrapingImages) {
      setBusyScrapingImages(true);
      const serverUrl = process.env.REACT_APP_EVOKE_IMAGES_DOWNLOAD_METHOD;
      try {
        const response = await axios.get(serverUrl);
        console.log(response.data);
        if (response.data.result === true) {
          console.log("Server did not time-out");
        } else {
          console.log("Server Timed Out");
        }
        setBusyScrapingImages(false);
      } catch (error) {
        console.log("Connection to server failed");
        setBusyScrapingImages(false);
        continiousScrapingImages();
      }
    }
  };

  const continiousCheckDeadUrls = async () => {
    if (!busyCheckingDeadUrls) {
      setBusyCheckingDeadUrls(true);
      const serverUrl = process.env.REACT_APP_CHECK_DEAD_URLS;
      try {
        const response = await axios.get(serverUrl);
        console.log(response.data);
        if (response.data.result === true) {
          console.log("Server did not time-out");
        } else {
          console.log("Server Timed Out");
        }
        setBusyCheckingDeadUrls(false);
      } catch (error) {
        console.log("Connection to server failed");
        setBusyCheckingDeadUrls(false);
      }
    }
  };

  return (
    <React.StrictMode>
      <div className="App">
        <header className="App-header">
          {!urls && (
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
          {urls !== false && (
            <Fragment>
              <main className="center-2">
                {/* EVOKE CHECKING DEAD URLS */}
                <div className="tab-class-1">
                  <div className={"center-1"} style={{ marginBottom: "40px" }}>
                    {busyCheckingDeadUrls && (
                      <Spinner className={"spinner-2"} animation="grow" />
                    )}
                    <button
                      className={"button-2"}
                      style={{
                        opacity: busyCheckingDeadUrls ? 0.5 : 1,
                      }}
                      onClick={continiousCheckDeadUrls}
                    >
                      {busyCheckingDeadUrls ? "CHECKING" : "CHECK"}
                    </button>
                    {busyCheckingDeadUrls && (
                      <Spinner className={"spinner-2"} animation="grow" />
                    )}
                  </div>
                  <table style={{ maxWidth: "500px" }}>
                    <tbody>
                      <tr>
                        <td style={{ margin: "0px 40px" }}>
                          <h4>
                            {totolScrapedStats.totalLive +
                              " Live | " +
                              totolScrapedStats.totalDead +
                              " Dead"}
                          </h4>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* EVOKE SCRAPE URLS */}
                <div className="tab-class-1">
                  <div className={"center-1"} style={{ marginBottom: "40px" }}>
                    {busyScrapingDeals && (
                      <Spinner className={"spinner-2"} animation="grow" />
                    )}
                    <button
                      className={"button-2"}
                      style={{
                        opacity:
                          urls.length === 0 || busyScrapingDeals ? 0.5 : 1,
                      }}
                      onClick={continiousScrapingDeals}
                    >
                      {busyScrapingDeals ? "SCRAPING" : "SCRAPE"}
                    </button>
                    {busyScrapingDeals && (
                      <Spinner className={"spinner-2"} animation="grow" />
                    )}
                  </div>
                  <table style={{ maxWidth: "500px" }}>
                    <tbody>
                      <tr>
                        <td style={{ margin: "0px 40px" }}>
                          {urlToScrape[0].length === 0 ? (
                            <h4>{urls.length} Urls To Scrape</h4>
                          ) : (
                            <h4>
                              Scraping {urlToScrape[1] + " of " + urls.length}:
                            </h4>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* EVOKE DOWNLOAD IMAGES */}
                <div className="tab-class-1">
                  <div className={"center-1"} style={{ marginBottom: "40px" }}>
                    {busyScrapingImages && (
                      <Spinner className={"spinner-2"} animation="grow" />
                    )}
                    <button
                      className={"button-2"}
                      style={{
                        opacity:
                          imagesToDownload.length === 0 || busyScrapingImages
                            ? 0.5
                            : 1,
                      }}
                      onClick={continiousScrapingImages}
                    >
                      {busyScrapingImages ? "DOWNLOADING" : "DOWNLOAD"}
                    </button>
                    {busyScrapingImages && (
                      <Spinner className={"spinner-2"} animation="grow" />
                    )}
                  </div>
                  <table style={{ maxWidth: "500px" }}>
                    <tbody>
                      <tr>
                        <td>
                          <h4>{imagesToDownload.length} Images To Download</h4>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ margin: "0px 40px" }}></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </main>
              <textarea
                style={{
                  fontSize: "16px",
                  marginBottom: "20px",
                  width: "80vw",
                  maxWidth: "1000px",
                  marginTop: "40px",
                  padding: "20px",
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
