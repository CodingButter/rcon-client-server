const cors = require("cors");
const DotEnv = require("dotenv");
const { Rcon } = require("rcon-client");
const uniqid = require("uniqid");
const toIp = require("./ToIp");

DotEnv.config();

const API = "/rcon";
const DECAY_TIME = Milliseconds(process.env.DECAY_TIME);
const IDLE_TIME = Milliseconds(process.env.IDLE_TIME);
const MAX_CONNECTIONS = process.env.MAX_CONNECTIONS;
var connections = [];

function ReturnResponse(response) {
  return response;
}

function Milliseconds(minutes) {
  return minutes * 60000;
}

function getConnectionByUID(requestedUID) {
  return connections.filter(({ uid }) => uid === requestedUID)[0];
}

function RconApi(app) {
  app.get(`${API}/start`, cors(), async (req, res) => {
    console.log("Starting Server");
    exec(SERVER_START_COMMAND);
    setTimeout(async () => {
      await handleRconConnect();
    }, 10000);
    res.json("<h1>server starting</h1>");
  });

  app.get(`${API}/connect`, cors(), async (req, res) => {
    if (
      connections.filter(({ status }) => status === "connected").length <
      MAX_CONNECTIONS
    ) {
      const rcon = new Rcon(req.query);
      rcon
        .connect()
        .then(() => {
          const uid = uniqid();
          connections.push({
            uid,
            rcon,
            status: "connected",
            pinged: Date.now(),
          });
          return ReturnResponse({
            status: "connected",
            uid,
          });
        })
        .catch((error) => {
          return ReturnResponse({
            status: "not_connected",
            error,
          });
        })
        .then((status) => {
          res.json(status);
        });
    } else {
      res.json(
        ReturnResponse({
          status: "not_connected",
          error: "Server Congestion",
        })
      );
    }
  });

  app.get(`${API}/send`, cors(), (req, res) => {
    const { uid, command } = req.query;
    const connection = getConnectionByUID(uid);
    if (connection) {
      const { rcon } = connection;
      connection.pinged = Date.now();
      const responseUID = uniqid();
      rcon.send(command).then((body) => {
        connection.response = {
          uid: responseUID,
          body,
        };
        res.json(
          ReturnResponse({
            connection: connection.status,
            status: "success",
            uid: responseUID,
            body,
          })
        );
      });
    } else {
      res.json(
        ReturnResponse({
          status: "failed",
          error: "connection doesn't exist",
        })
      );
    }
  });

  app.get(`${API}/response`, cors(), (req, res) => {
    const { uid } = req.query;
    const connection = getConnectionByUID(uid);
    if (connection) {
      connection.pinged = Date.now();
      res.json(
        ReturnResponse({
          connection: connection.status,
          status: "success",
          response: connection.response,
        })
      );
    } else {
      res.json(
        ReturnResponse({
          status: "failed",
          error: "connection doesn't exist",
        })
      );
    }
  });

  app.get(`${API}/status`, cors(), (req, res) => {
    const { uid } = req.query;
    const connection = getConnectionByUID(uid);
    if (connection) {
      //connection.pinged = Date.now();
      res.json(
        ReturnResponse({
          status: connection.status,
        })
      );
    } else {
      res.json(
        ReturnResponse({
          status: "failed",
          error: "connection doesn't exist",
        })
      );
    }
  });

  app.get(`${API}/toip`, cors(), async (req, res) => {
    const { ipdomain } = req.query;
    const ip = await toIp(ipdomain);
    res.json({ ip });
  });

  setInterval(() => {
    const now = Date.now();
    connections = connections.filter((connection) => {
      const idlefor = now - connection.pinged;
      return idlefor < DECAY_TIME;
    });
    connections.map((connection) => {
      const idlefor = now - connection.pinged;
      if (idlefor > IDLE_TIME && connection.status == "connected") {
        connection.rcon.end();
        connection.status = "disconnected";
      }
    });
    console.log({
      total: connections.length,
      active: connections.filter(({ status }) => status == "connected").length,
    });
  }, IDLE_TIME);
}

module.exports = RconApi;
