import fetchCases from "./fetchCases";
import fetchAnnouncements from "./fetchAnns";
import { Worker } from "worker_threads";

// .js, not .ts. The action is in the build folder
const casesWorkDir = __dirname + "/casesWorker.js";
const announcementsWorkDir = __dirname + "/annsWorker.js";

// Save case list to local data folder. In the future, may use
// worker_threads to process & push to a remote database.
fetchCases().then((response) => {
    // Unlike fetchAnnouncements, fetchCases might return undefined
    if (response) {
        // Start worker
        const worker = new Worker(casesWorkDir);
        console.log("Sending case data to casesWorker...");

        // Send to cases worker thread
        worker.postMessage(response);

        // Listen to message from cases worker
        worker.on("message", (message) => console.log(message));
    }
});

fetchAnnouncements().then((response) => {
    // Start worker
    const worker = new Worker(announcementsWorkDir);
    console.log("Sending case data to casesWorker...");

    // Send to cases worker thread
    worker.postMessage(response);

    // Listen to message from cases worker
    worker.on("message", (message) => console.log(message));
});
