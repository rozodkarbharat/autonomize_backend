const express = require("express");
const connection = require("./db");
const cors = require("cors");
const userRoute = require("./Routes/user.route");


const app = express();

app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

app.use("/user",userRoute)


app.get("/", (req, res) => {
    try {
        res.status(200).send("Welcome to the ERP server")
    }
    catch (err) {
        console.log(err, "error in /")
        res.status(401).send("error in /");
    }
})




app.listen(5000, () => {
    try {
        console.log("server running on 5000")
        connection
    }
    catch (e) {
        console.log("error running on 8000", e.message);
    }
})