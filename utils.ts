import axios from "axios";
import https from "https";

/**
 * Send an HTTP request to a web page. If the request goes through, 
 * the response will carry the page's HTML layout & data.
 * @param url URL from which to fetch
 */
export async function fetchData(url: string) {
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
