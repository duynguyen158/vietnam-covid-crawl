// CLI: node main.js

const axios = require("axios");
const cheerio = require("cheerio");
const https = require("https");

fetchCases().then((res) => {
    // Print out case list for the time being. In the future,
    // may use worker_threads to process & push to a remote database.
    console.log(res);
});

async function fetchCases() {
    const url = "https://ncov.moh.gov.vn";

    // Fetch
    const res = await fetchData(url);
    if (!res.data) {
        console.log("Invalid data object");
        return;
    }

    const html = res.data;
    // Mount HTML page to root element
    const $ = cheerio.load(html);

    const data = new Array();
    const table = $(".table.table-striped.table-covid19 > tbody > tr");

    // Loop through all table rows
    table.each(function () {
        const datum = $(this)
            .find("td")
            .map(function () {
                return $(this).text();
            })
            .get();
        data.push(datum);
    });

    return data;
}

async function fetchData(url) {
    console.log(`...Crawling from ${url}...`);

    // We're only acessing the page for data, so disabling client verification is fine
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
    });

    // Make HTTP call to URL
    const response = await axios
        .get(url, { httpsAgent })
        .catch((err) => console.log(err));

    if (response.status !== 200) {
        console.log("Error occured while fetching data");
        return;
    }

    return response;
}
