const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const xss = require("xss-clean");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");

//Load env vars
dotenv.config({path: "./config/config.env"});

//Connect to database
connectDB();

//Route files
const readings = require("./routes/readings");
const auth = require("./routes/auth");

const app = express();

//Body Parser
app.use(express.json());

//Cookie Parser
app.use(cookieParser());

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Sanitive data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Prevent xss attacks
app.use(xss());

//Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 minutes
  max: 100,
});
app.use(limiter);

//Enable CORS
app.use(cors());

// Prevent http param pollution
app.use(hpp());

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

//Mount routes
app.use("/api/v1/readings", readings);
app.use("/api/v1/auth", auth);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`)
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  //Close server and exit process
  server.close(() => process.exit(1));
});
