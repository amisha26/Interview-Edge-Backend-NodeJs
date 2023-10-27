const mongoose = require("mongoose");

/* MongoDb Connection */
async function dbConnection(MONGO_URL) {
    try {
        await mongoose.connect(MONGO_URL, {useNewUrlParser: true}).then(
            () => {
                console.log("MongoDb is connected");
            }
        );
    } catch (err) {
        console.error("❌ Error connecting to MongoDb", err);
        process.exit(1);
    }

}

module.exports = dbConnection;