const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");

//database config file
const db = require("./config/database");

//dbconnection test
db.authenticate()
  .then(() => console.log("Database connected...."))
  .catch(err => console.log("Error: " + err));

const app = express();

// HandleBars
// every views including css we want to wrap in layout in main.handelbars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//bodyparser
app.use(bodyParser.urlencoded({ extended: false }));

//set static folder
//in html file we don't need to put path as '/public/css/style.css'
//instead we will put '/css/style.css'
app.use(express.static(path.join(__dirname, "public")));

//Index route
//for landing page we want differnt layout
//we want to use other  layout instead of default which is 'main.handlebars',we defined it above
//use object {layout:<name of the layout>} for using different layout
app.get("/", (req, res) => {
  res.render("index", { layout: "landing" });
});

//job routes
app.use("/jobs", require("./routes/gig"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
