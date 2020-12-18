const Express = require("express");
const DotEnv = require("dotenv");
const RconApi = require("./RconApi");
const fs = require("fs");
const https = require("https");
const path = require("path");
DotEnv.config();
const app = Express();

const httpsOptions = {
    cert: fs.readFileSync(path.joint(__dirname, 'ssl', 'server.crt')),
    key: fs.readFileSync(path.join(__dirname,'ssl','server.key'))
}

RconApi(app);

https.createServer(httpsOptions, app)
    .listen(process.env.PORT, () => {
    const log(`Serving on port ${process.env.PORT}`)
})
