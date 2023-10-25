const csv = require('csv-parser');
const fs = require('fs');

async function csvToJson(csvFilePath, QuestionModel) {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                const question = new QuestionModel({
                    questionUrl: row.question_url,
                    _id: row.question_id,
                    topicName: row.topic_name,
                    questionName: row.question_name,
                    level: row.level,
                    platform: row.platform
                });

                // Save the document to the MongoDB collection
                results.push(question.save());
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