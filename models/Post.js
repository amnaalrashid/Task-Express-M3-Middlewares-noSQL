const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: { type: String },
  content: { type: String },
  image: { type: String }, // Add this line
  // ... any other fields you have
});

module.exports = mongoose.model("Post", PostSchema);
