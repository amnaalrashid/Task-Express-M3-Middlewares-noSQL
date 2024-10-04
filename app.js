const express = require("express");
const app = express();
const postsRoutes = require("./api/posts/posts.routes");
const connectDb = require("./database");
const cors = require("cors");
const morgan = require("morgan");
const notFoundHandler = require("./middlewares/notFoundHandler");
const dotenv = require("dotenv");

dotenv.config();
connectDb();
app.use(express.json());
app.use("/posts", postsRoutes);
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/posts", postsRoutes);
app.use(cors());
app.use(morgan("dev"));
app.use(notFoundHandler);

app.listen(process.env.PORT, () => {
  console.log(`The application is running on localhost:${process.env.PORT}`);
});
