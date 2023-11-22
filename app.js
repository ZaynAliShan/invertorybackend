require("express-async-errors");
require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./db/connection");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const port = process.env.PORT || 5000;
const REMOTE_CLIENT = process.env.REMOTE_CLIENT;

// Rest of the packages
app.use(express.json());
app.use(cookieParser());

// Make sure REMOTE_CLIENT does not have a trailing slash
const allowedOrigins = ["https://inventoryfrontend.netlify.app", REMOTE_CLIENT].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Importing Middlewares
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

// Importing Routers
const authRouter = require("./routes/auth");
const productsRouter = require("./routes/products");
const usersRouter = require("./routes/users");

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/products", productsRouter);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

// Starting Server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => console.log(`Server is listening on port: ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
