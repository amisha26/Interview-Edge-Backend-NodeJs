const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userAuth = require("./routes/auth");
const exploreRoute = require("./routes/explore");
const profileRoute = require("./routes/profile");
const Questions = require("./models/Questions");
const csvToJson = require("./script");


// utils
//const SwaggerOptions = require("./utils/swagger");



dotenv.config();

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}).then(
    () => {
        console.log("MongoDb is connected");
    }
);


// Add CSV data to MongoDb schema
const csv_path = "./csv/questions.csv";
//csvToJson(csv_path, Questions);


//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// ============ SWAGGER =========
//const swaggerSpec = swaggerJsDoc(SwaggerOptions);
//app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));




app.use("/auth", userAuth);
app.use("/explore", exploreRoute);
app.use("/profile", profileRoute);




app.listen(8800, () => {
    console.log("server is running");
});