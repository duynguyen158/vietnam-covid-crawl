import cheerio from "cheerio";
import { fetchData, validate } from "./utils";

fetchCases().then((response) => {
    // Print out case list for the time being. In the future,
    // may use worker_threads to process & push to a remote database.
    console.log(response);
});

fetchAnnouncements().then((response) => {
    // Print out announcement list for the time being. In the future,
    // may use worker_threads to process & push to a remote database.
    console.log(response);
});

async function fetchAnnouncements() {
    let url = "https://ncov.moh.gov.vn/web/guest/dong-thoi-gian";
    let carryOn = true;

    const data = new Array<Object>();

    // Announcement timeline is paginated, so a do-while loop takes us to next page.
    do {
        // Fetch
        const response = await fetchData(url);

        // Validate
        const html = validate(response);
        if (html === undefined) break;

        // Mount HTML page to root element
        const $ = cheerio.load(html);

        // Container (list) of all announcements in our current page
        const timeline = $(".timeline-sec > ul");

        // Loop through all list elements
        const prefix = "li > .timeline > .timeline-detail";
        timeline.each((_, d: element) => {
            // Timestamp (HH:MM d/m/Y, GMT+7)
            const timestamp = $(d)
                .find(`${prefix} > .timeline-head > h3`)
                .text();

            // Content of each announcement
            const paragraphs: string[] = $(d)
                .find(`${prefix} > .timeline-content > p`)
                .map((_, d: element) => $(d).text())
                .get();

            data.push({ timestamp, paragraphs });
        });

        // Button to next page
        const nextButton = $(".lfr-pagination-buttons.pager > li")[1];

        // Obtain URL to next page.
        // If there is a valid one, continue loop. Otherwise, break.
        if ($(nextButton).hasClass("disabled")) {
            carryOn = false;
        } else {
            const href = $(nextButton).find("a").attr("href");
            if (href === undefined) {
                console.log(
                    "IMPORTANT: URL to next page is compromised. Fetching will stop. Data might be incomplete."
                );
                break;
            }
            url = href;
        }
    } while (carryOn);

    return data;
}

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
