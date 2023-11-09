const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const mongoose = require("mongoose");
dotenv.config();
const MongoStore = require("connect-mongo");
const cors = require("cors");
const app = express();
const session = require("express-session");

require("./config/passport")(passport);

const MONGO_URI = 'mongodb+srv://ltm:khA8NIwPTX165yMc@ltm.e0pdzky.mongodb.net/?retryWrites=true&w=majority';

app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));

app.use(
  session({
    secret: "some random secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(
  MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("DB Connected")
);

app.use("/api/code", require("./routes/codeRoutes"));
app.use("/api/problem", require("./routes/problemRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

app.get('/', (req, res) => {
  res.send('APP IS RUNNING')
})

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failed",
  }),
  (req, res) => {
    res.redirect("http://localhost:3000/");
  }
);

const PORT = process.env.PORT || 5434;

app.listen(PORT, () => console.log("Server is listening"));
