import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Storage } from '@google-cloud/storage';
import { BigQuery } from '@google-cloud/bigquery';

process.env.GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS || "E:/UPenn/24Spring/MUSA509/MUSA509_Marine_Pollution/Data_Loading/keys/musa509-marine-pollution-1bc9d224ac35.json";
const DATA_LAKE_BUCKET=musa509_marine_pollution_raw_data
const PREPARED_DATA_BUCKET=musa509_marine_pollution_prepared_data
const DATA_LAKE_DATASET=source
const INTERNAL_DATASET=core

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAW_DATA_DIR = path.join(__dirname, 'raw_data/population/');
const PREPARED_DATA_DIR = path.join(__dirname, 'prepared_data/population/');

const rawFilename = path.join(RAW_DATA_DIR, 'ChennaiWards_pop2020estimation.geojson');
const preparedFilename = path.join(PREPARED_DATA_DIR, 'ChennaiWards_pop2020estimation.jsonl');

const bucketName = process.env.DATA_LAKE_BUCKET;
const storageClient = new Storage();
const bucket = storageClient.bucket(bucketName);

// Download the raw data from cloud storage
const rawBlobname = 'population/ChennaiWards_pop2020estimation.geojson';
await bucket.file(rawBlobname).download({ destination: rawFilename });
console.log(`Downloaded to ${rawFilename}`);

// Load the data from the GeoJSON file
const geojsonData = JSON.parse(await fs.readFile(rawFilename, 'utf8'));

// Write the data to a JSONL file
const f = await fs.open(preparedFilename, 'w');
for (const feature of geojsonData.features) {
  await f.write(JSON.stringify(feature) + '\n');
}

console.log(`Processed data into ${preparedFilename}`);

// Upload the prepared data to cloud storage
const Prepared_Bucket_Name = process.env.PREPARED_DATA_BUCKET;
const prepared_bucket = storageClient.bucket(Prepared_Bucket_Name);
const preparedBlobname = 'population/ChennaiWards_pop2020estimation.jsonl';
await prepared_bucket.upload(preparedFilename, { destination: preparedBlobname });
console.log(`Uploaded to ${preparedBlobname}`);

// Load the data into BigQuery as an external table
const datasetName = process.env.DATA_LAKE_DATASET;
const tableName = 'population';
const tableUri = `gs://${Prepared_Bucket_Name}/${preparedBlobname}`;

const createTableQuery = `
CREATE OR REPLACE EXTERNAL TABLE ${datasetName}.${tableName}
OPTIONS (
  format = 'JSON',
  uris = ['${tableUri}']
)
`;

const bigqueryClient = new BigQuery();
await bigqueryClient.query(createTableQuery);
console.log(`Loaded ${tableUri} into ${datasetName}.${tableName}`);
