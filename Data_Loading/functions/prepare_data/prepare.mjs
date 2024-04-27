import fs from 'fs/promises';
import path from 'path';

// Correctly set up file paths using path.join for compatibility across platforms
const baseDir = path.join("E:", "UPenn", "24Spring", "MUSA509", "MUSA509_Marine_Pollution", "Data_Loading", "functions");
const rawFilename = path.join(baseDir, "raw_data", "OSM", "chennai_stagnation_locations_2015.geojson");
const preparedFilename = path.join(baseDir, "prepared_data", "OSM", "chennai_stagnation_locations_2015.jsonl");

// Load the data from the GeoJSON file
const geojsonData = JSON.parse(await fs.readFile(rawFilename, 'utf8'));

// Write the data to a JSONL file
const fileHandle = await fs.open(preparedFilename, 'w');
for (const feature of geojsonData.features) {
    await fileHandle.write(JSON.stringify(feature) + '\n');
}
await fileHandle.close();  // Make sure to close the file handle to flush everything to disk

console.log(`Processed data into ${preparedFilename}`);
