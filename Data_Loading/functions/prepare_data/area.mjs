import fs from 'fs';
import readline from 'readline';

// Define the paths for the input and output files
const inputFile = 'E:\\UPenn\\24Spring\\MUSA509\\MUSA509_Marine_Pollution\\Data_Loading\\functions\\prepared_data\\population\\ChennaiWards_pop2020estimation.jsonl';
const outputFile = 'E:\\UPenn\\24Spring\\MUSA509\\MUSA509_Marine_Pollution\\Data_Loading\\functions\\prepared_data\\population\\ChennaiWards_pop2020estimation_clean.jsonl';

// Create a readline interface

const rl = readline.createInterface({
    input: fs.createReadStream(inputFile),
    output: fs.createWriteStream(outputFile),
    terminal: false
});

rl.on('line', (line) => {
    try {
        let data = JSON.parse(line);  // Try to parse JSON

        if (data.properties && data.properties["Area(km2)"]) {
            data.properties.Area = data.properties["Area(km2)"];
            delete data.properties["Area(km2)"];  // Modify the property name
        }

        rl.output.write(JSON.stringify(data) + '\n');  // Write the modified object back
    } catch (error) {
        console.error(`Failed to process line: ${line}`);
        console.error(`Error: ${error.message}`);
    }
});

rl.on('close', () => {
    console.log('Finished processing the file.');
});
