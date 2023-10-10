const SwaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Code Web App",
        version: "1.0.0",
        description: "Code Web App API Documentation",
      },
    },
    apis: ["./routes/auth.js", "./routes/explore.js", "./routes/profile.js"],
  };
  
  module.exports = SwaggerOptions;