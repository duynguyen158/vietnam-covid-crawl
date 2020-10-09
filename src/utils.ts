import axios, { AxiosResponse } from "axios";
import https from "https";

/**
 * Send an HTTP request to a web page. If the request goes through,
 * the response will carry the page's HTML layout & data.
 * @param url URL from which to fetch
 */
export async function fetchData(url: string) {
    console.log(`..........Crawling from ${url}..........`);

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

/**
 * Check if an HTTP response returned by `fetchData` contains a valid data object.
 * If it does, return that data object.
 * @param response Response to check
 */
export function validate(response: AxiosResponse<string> | undefined) {
    if (!response) return; // If response is invalid
    if (!response.data) {
        // If data of response is invalid
        console.log("Invalid data object");
        return;
    }
    return response.data;
}

/**
 * Get timestamp at the moment of calling, in UTC time.
 */
export function getTimestamp() {
    return new Date().toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "UTC",
        timeZoneName: "short",
    });
}
