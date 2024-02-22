import express from "express"; // Importing Express framework for handling HTTP requests and responses.
import bodyParser from "body-parser"; // Importing body-parser middleware to parse incoming request bodies.
import mongoose from "mongoose"; // Importing Mongoose ORM for MongoDB to interact with the database.
import cors from "cors"; // Importing CORS middleware to handle Cross-Origin Resource Sharing.
import helmet from "helmet"; // Importing Helmet middleware for securing HTTP headers.
import multer from "multer"; // Importing Multer middleware for handling multipart/form-data.
import dotenv from "dotenv"; // Importing dotenv to load environment variables from a .env file.
import morgan from "morgan"; // Importing Morgan middleware for logging HTTP requests.
import path from "path"; // Importing path module to manipulate file paths.
import { fileURLToPath } from "url"; // Importing fileURLToPath function to convert file URLs to file paths.
import { register } from "./controllers/auth.js"


// CONFIGURATIONS

// Setting up file and directory paths
const __filename = fileURLToPath(import.meta.url); // Convert file URL of the current module to a file path.
const __dirname = path.dirname(__filename); // Get the directory name of the current module's file.
dotenv.config(); // Load environment variables from .env file into process.env.
const app = express(); // Create an Express application.

// Middleware setup
app.use(express.json()) // Parsing incoming JSON requests.
app.use(helmet()); // Setting various HTTP headers for security.
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Configuring CORS policy.
app.use(morgan("common")); // Logging HTTP requests using the 'common' format.
app.use(bodyParser.json({ limit: "30mb", extended: true })); // Parsing JSON requests with specified options.
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); // Parsing URL-encoded requests with specified options.
app.use(cors()); // Enabling Cross-Origin Resource Sharing.
// Serving static files from the specified directory
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// FILE STOREAGE

// Configure the storage engine using multer.diskStorage
const storage = multer.diskStorage({
  // Define the destination directory for uploaded files
  destination: (req, file, cb) => {
    // Set the destination path to "public/assets"
    cb(null, "public/assets");
  },
  // Define the filename for uploaded files
  filename: (req, file, cb) => {
    // Keep the original filename
    cb(null, file.originalname);
  }
});
// Create a multer upload middleware instance
const upload = multer({ storage });

// ROUTES WITH FILES
app.post("/auth/register", upload.single("picture"), register )

// MONGOOSE SETUP

// Set the port for the application, defaulting to 3000 if not specified in environment variables
const PORT = process.env.PORT || 3000;
// Connect to the MongoDB database using Mongoose
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParse: true,  // Ensure compatibility with newer MongoDB connection strings
    useUnifiedTopology: true, // Use the new MongoDB driver topology engine
})
.then(() => {
    //If connection is successful, start the server and log a message
    app.listen(PORT, () => console.log(`Connected to DB and listening on Port ${PORT}`));
})
.catch((error) => {
    console.log(`Error: ${error}, did not connect`);
});