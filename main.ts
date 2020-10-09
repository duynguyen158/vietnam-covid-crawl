import fetchCases from "./fetchCases";
import fetchAnnouncements from "./fetchAnnouncements";

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
