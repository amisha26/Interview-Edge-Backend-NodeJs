const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");

// utils
//const SwaggerOptions = require("./utils/swagger");
const dbConnection = require("./utils/dbConnection");

// routes
const userAuth = require("./routes/auth");
const exploreRoute = require("./routes/explore");
const profileRoute = require("./routes/profile");
const Questions = require("./models/Questions");
const userQuestions = require("./models/UserQuestions");
const Users = require("./models/Auth");
const csvToJson = require("./script");


// ========== MIDDLEWARE ==========
const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());



// ========= ENV VARIABLES =========
dotenv.config();
const PORT = process.env.PORT || 8800;
const MONGO_URL = process.env.MONGO_URL;



// ========= Connecting to MongoDb database ========= 
dbConnection(MONGO_URL);


// Add CSV data to MongoDb schema (data migration from postgresql to mongodb)
const questions_csv_path = "./csv/questions.csv";
//csvToJson(questions_csv_path, Questions);
const userquestions_csv_path = "./csv/userquestions.csv";
//csvToJson(userquestions_csv_path, userQuestions);
const users_csv_path = "./csv/users.csv";
//csvToJson(users_csv_path, Users);




// ============ SWAGGER =========
//const swaggerSpec = swaggerJsDoc(SwaggerOptions);
//app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// ========= ROUTES =========
app.use("/api/v1/", userAuth);
app.use("/api/v1/", exploreRoute);
app.use("/api/v1/profile", profileRoute);



app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
});