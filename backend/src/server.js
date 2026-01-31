const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/uploads", express.static("uploads"));

app.use("/api/donations", require("./routes/donationRoutes"));
app.use("/api/institutes", require("./routes/instituteRoutes"));
app.use("/api/shops", require("./routes/shopRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/llm", require("./routes/llmRoutes"));
app.use("/api/batch", require("./routes/batchRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/uploads", require("./routes/uploadRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

app.get("/", (req, res) => {
  res.send("Donation Platform API is running...");
});

app.use(errorHandler);

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
