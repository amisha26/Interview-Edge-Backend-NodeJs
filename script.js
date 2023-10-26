const csv = require('csv-parser');
const fs = require('fs');
const scriptData = require('./projData/scriptData.json')

async function csvToJson(csvFilePath, Model) {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                const modelData = {}
                const modelFields = scriptData.fields;

                Object.entries(modelFields).forEach(([schemaKey, csvKey]) => {
                    const csvColumn = csvKey;
                    modelData[schemaKey] = row[csvColumn];
                })
                const model = new Model(modelData);
                results.push(model.save());
            })
            .on('end', () => {
                Promise.all(results)
                    .then(() => {
                        console.log('CSV data has been added to the MongoDB collection.');
                        resolve();
                    })
                    .catch((err) => {
                        console.error(`Error adding data: ${err}`);
                        reject(err);
                    });
            });
    });
}

module.exports = csvToJson;