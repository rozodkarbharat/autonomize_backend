const express = require("express");
const connection = require("./db");
const cors = require("cors");


const app = express();

app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));


app.get("/", (req, res) => {
    try {
        res.status(200).send("Welcome to the ERP server")
    }
    catch (err) {
        console.log(err, "error in /")
        res.status(401).send("error in /");
    }
})




app.listen(8000, () => {
    try {
        console.log("server running on 8000")
        connection
    }
    catch (e) {
        console.log("error running on 8000", e.message);
    }
})