// Worker to process & push case list

import { writeFile } from "fs";
import { parentPort } from "worker_threads";
import { getTimestamp } from "./utils";

// Get timestamp at moment of save, in UTC time
const timestamp = getTimestamp();

if (parentPort) {
    // Receive crawled data from main thread
    parentPort.once("message", (message: string[][]) => {
        console.log("casesWorker: Received cases data from main worker...");

        const data = {
            savedAt: timestamp,
            data: message,
        };

        // Store data in a local file.
        // In the future, may output to a remote database.
        writeFile(
            `data/cases${Date.now()}.json`,
            JSON.stringify(data),
            (error) => {
                if (error) throw error;
                parentPort?.postMessage("Cases data saved successfully!");
            }
        );
    });
} else {
    throw new Error("Parent port is unavailable.");
}
