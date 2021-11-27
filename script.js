const Express = require("express");
const bodyParser = require("body-parser");
const app = Express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(1025, () => {});
app.get("/", (request, response) => {
    response.send("Ciao mondo");
});