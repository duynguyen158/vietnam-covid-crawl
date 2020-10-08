import axios from "axios";
import cheerio from "cheerio";
import https from "https";

fetchCases().then((res) => {
    // Print out case list for the time being. In the future,
    // may use worker_threads to process & push to a remote database.
    console.log(res);
});

async function fetchCases() {
    const url = "https://ncov.moh.gov.vn";

    // Fetch
    const res = await fetchData(url);

    // Validate
    if (!res) return;   // If response is undefined
    if (!res.data) {    // If response.data is undefined
        console.log("Invalid data object");
        return;
    }

    const html = res.data;
    // Mount HTML page to root element
    const $ = cheerio.load(html);

    const data: string[][] = new Array();
    const table = $(".table.table-striped.table-covid19 > tbody > tr");

    // Loop through all table rows
    table.each(function (this: element) {
        const datum: string[] = $(this)
            .find("td")
            .map(function (this: element) {
                return $(this).text();
            })
            .get();
        data.push(datum);
    });

    return data;
}

type element = cheerio.Element;

async function fetchData(url: string) {
    console.log(`...Crawling from ${url}...`);

    // We're only acessing the page for data, so disabling client verification is fine
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
    });

    // Make HTTP call to URL
    try {
        const response = await axios.get<string>(url, { httpsAgent });
        const { status, statusText } = response;
        // 200 = Sucessful
        if (status !== 200) {
            console.log(`Failed to fetch. CODE ${status}: ${statusText}`);
            return;
        }
        return response;
    } catch (error) {
        // Print out errors and return undefined;
        console.log(error);
        return;
    }
}
