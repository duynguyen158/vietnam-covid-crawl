Crawling the Vietnam Ministry of Health's COVID stats page (https://ncov.moh.gov.vn/) for case data & official pandemic timeline with TypeScript & Node. This is a developing project.

To set things up, install dependencies as listed in `package.json` and create the build folder,
```
mkdir build
``` 

To compile & run the main script,
```
tsc
node build/main.js
```

This will create 2 new JSON files in the `data` folder for cases and announcements, ID-ed by milliseconds since Unix epoch. (Refer to `data/examples`.)