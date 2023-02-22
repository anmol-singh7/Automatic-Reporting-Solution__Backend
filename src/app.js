const dotenv = require("dotenv")
dotenv.config({ path: "../.env" });
const express = require("express");
const bodyParser = require("body-parser");
require("./db/connection");

const Create_User_Router = require("./routers/Create_Users");

const app = express();
const PORT = 3000;
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 100000, limit: "50mb" }));
// app.use(bodyParser.json())
app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb' }));
// app.use(express.json());   //<-- use to read req.body withot it give undefined
app.use('/api',Create_User_Router);



app.listen(PORT, () => {
    console.log(`connection is setup at ${PORT}`);
})