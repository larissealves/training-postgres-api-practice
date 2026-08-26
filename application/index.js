const express = require("express");

const app = express();
const port = 3000;
const hostname = "127.0.0.1";

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.listen(port, hostname, () => {
    console.log(`Example app listening on port http://${hostname}:${port}/`);
});