const csv = require('csv-parser');
const fs = require('fs');
const scriptData = require('./projData/scriptData')

async function csvToJson(csvFilePath, Model) {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                //const questionData = {};
                const userQuestionsData = {};
                //const usersData = {}

            //     for (const modelField in scriptData.userAuthModel) {
            //         const csvColumn = scriptData.userAuthModel[modelField];
            //         usersData[modelField] = row[csvColumn];
            //    }

                // for (const modelField in scriptData.userAuthModel) {
                //     const csvColumn = scriptData.userAuthModel[modelField];
                //     usersData[modelField] = row[csvColumn];
                // }

                for (const modelField in scriptData.userQuestionModel) {
                    const csvColumn = scriptData.userQuestionModel[modelField];
                    userQuestionsData[modelField] = row[csvColumn];
                }



                //const question = new Model(questionData);
                const userQuestions = new Model(userQuestionsData);
                //const users = new Model(usersData);

                // Save the document to the MongoDB collection
                //results.push(question.save());
                results.push(userQuestions.save());
                //results.push(users.save());
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