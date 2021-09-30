const util = require("util");
const exec = util.promisify(require("child_process").exec);

const express = require("express");
const https = require("https");
const fs = require("fs");

const app = express();
const port = 443;

let key = fs.readFileSync(__dirname + "/ssl-cert-snakeoil.key");
let cert = fs.readFileSync(__dirname + "/ssl-cert-snakeoil.pem");
let options = {
  key: key,
  cert: cert,
};

const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

/* requetes api */

async function scanMap(ipMap, portMap) {
  try {
    const { stdout } = await exec(`nmap -Pn -p ${portMap} ${ipMap}`);
    return stdout;
  } catch (err) {
    return err;
  }
}

app.get("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("accueil");
  res.send("askip c'est en https");
});

app.get("/michel", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("michel envoyé");
  res.send("M I C H E L");
});

app.get("/getIp", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const ipQuery = req.query.ip;
  const portQuery = req.query.port;

  if (ipQuery && portQuery) {
    const response = await scanMap(ipQuery, portQuery);
    res.send(response);
  } else {
    res.send("Erreur, champ(s) vide(s). Réessayez");
  }
  console.log("scan envoyé");
});

var server = https.createServer(options, app);

server.listen(port, () => {
  console.log("server starting on port : " + port);
});
