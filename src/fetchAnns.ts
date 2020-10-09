// Fetch list of MIH announcements

import cheerio from "cheerio";
import { fetchData, validate } from "./utils";

async function fetchAnnouncements() {
    let url = "https://ncov.moh.gov.vn/web/guest/dong-thoi-gian";
    let carryOn = true;

    const data = new Array<Object>();

    console.log("\n----------FETCHING ANNOUNCEMENTS----------");

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
        timeline.each((_, d: cheerio.Element) => {
            // Timestamp (HH:MM d/m/Y, GMT+7)
            const vnTimestamp = $(d)
                .find(`${prefix} > .timeline-head > h3`)
                .text();

            // Content of each announcement
            const paragraphs: string[] = $(d)
                .find(`${prefix} > .timeline-content > p`)
                .map((_, d: cheerio.Element) => $(d).text())
                .get();

            data.push({ vnTimestamp, paragraphs });
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

export default fetchAnnouncements;
