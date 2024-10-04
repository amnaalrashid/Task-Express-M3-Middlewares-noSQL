const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const postsRoutes = require("./api/posts/posts.routes");
const connectDb = require("./database");
const cors = require("cors");
const morgan = require("morgan");
const notFoundHandler = require("./middlewares/notFoundHandler");
const dotenv = require("dotenv");
const errorHandler = require("./middlewares/errorHandler");

dotenv.config();
connectDb();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Setup Media Folder
const mediaPath = path.join(__dirname, "media");
console.log("Media path:", mediaPath);

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

// Serve static files from the media folder with detailed logging
app.use("/media", (req, res, next) => {
  const filePath = path.join(mediaPath, req.path);
  console.log("Attempting to serve:", filePath);
  console.log("File exists:", fs.existsSync(filePath));

  fs.readdir(mediaPath, (err, files) => {
    if (err) {
      console.error("Error reading media directory:", err);
    } else {
      console.log("Files in media directory:", files);
    }
  });

  express.static(mediaPath)(req, res, next);
});

// Add this route for debugging
app.get("/media-debug", (req, res) => {
  fs.readdir(mediaPath, (err, files) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({
        mediaPath,
        files,
        exists: fs.existsSync(mediaPath),
        isDirectory:
          fs.existsSync(mediaPath) && fs.lstatSync(mediaPath).isDirectory(),
      });
    }
  });
});

// Routes
app.use("/posts", postsRoutes);

// Move the notFoundHandler here, after all other routes
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`The application is running on localhost:${process.env.PORT}`);
});
