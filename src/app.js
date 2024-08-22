const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const routerUser = require("../routers/users");
const routerArtical = require("../routers/articals");
require("../db/mongoose"); // connect for mongoose server

app.use(express.json());

app.use(routerUser);
app.use(routerArtical);

app.listen(port, () => {
    console.log("Browser now listening to : " + port);
});