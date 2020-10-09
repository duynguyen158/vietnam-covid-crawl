import cheerio from "cheerio";
import { fetchData, validate } from "./utils";

fetchCases().then((res) => {
    // Print out case list for the time being. In the future,
    // may use worker_threads to process & push to a remote database.
    console.log(res);
});

async function fetchCases() {
    const url = "https://ncov.moh.gov.vn";

    // Fetch
    const response = await fetchData(url);

    // Validate
    const html = validate(response);
    if (html === undefined) return;

    // Mount HTML page to root element
    const $ = cheerio.load(html);

    const data = new Array<string[]>();
    const table = $(".table.table-striped.table-covid19 > tbody > tr");

    // Loop through all table rows
    table.each((_, d: element) => {
        const datum: string[] = $(d)
            .find("td")
            .map((_, d: element) => $(d).text())
            .get();
        data.push(datum);
    });

    return data;
}

// Type placeholder for Cheerio Elements
type element = cheerio.Element;
