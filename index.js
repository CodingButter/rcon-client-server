const Express = require("express");
const DotEnv = require("dotenv");
const RconApi = require("./RconApi");
const MinecraftApi = require("./MinecraftProfileApi");
const fs = require("fs");
const https = require("https");
const path = require("path");
DotEnv.config();
const app = Express();

const httpsOptions = {
  cert: fs.readFileSync(path.resolve(process.env.SSL_CERT)),
  key: fs.readFileSync(path.resolve(process.env.SSL_KEY)),
};

RconApi(app);
MinecraftApi(app);
https.createServer(httpsOptions, app).listen(process.env.PORT, () => {
  console.log(`Serving on port ${process.env.PORT}`);
});
