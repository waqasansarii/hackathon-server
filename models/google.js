const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/HACKATHON")
  .then(() => {
    console.log("mongodb connected");
  })
  .catch(() => {
    console.log("failed");
  });

const googleSchema = new mongoose.Schema(
  {
    googleId: String,
    displayName: String,
    email: String,
    image: String,
  },
  { timestamps: true }
);
const googleModel = new mongoose.model("users", googleSchema);

module.exports = googleModel