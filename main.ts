import cheerio from "cheerio";
import { fetchData } from "./utils";

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

// Type placeholder for Cheerio Elements
type element = cheerio.Element;
