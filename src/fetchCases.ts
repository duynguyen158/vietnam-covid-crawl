// Fetch list of COVID-19 cases confirmed by MIH

import cheerio from "cheerio";
import { fetchData, validate } from "./utils";

async function fetchCases() {
    const url = "https://ncov.moh.gov.vn";

    console.log("\n----------FETCHING CASES----------");

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
    table.each((_, d: cheerio.Element) => {
        const datum: string[] = $(d)
            .find("td")
            .map((_, d: cheerio.Element) => $(d).text())
            .get();
        data.push(datum);
    });

    return data;
}

export default fetchCases;
