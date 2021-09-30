const util = require("util");
const exec = util.promisify(require("child_process").exec);

const express = require("express");
const app = express();
const port = 3842;

const cors = require("cors");
app.use(cors());

async function scanMap(ipMap, portMap) {
    try {
        const { stdout } = await exec(`nmap -Pn -p ${portMap} ${ipMap}`);
        return stdout;
    } catch (err) {
        return err;
    }
}

app.get("/", (req, res) => {
    console.log("accueil");
    res.send("Api Bypass");
});

app.get("/michel", (req, res) => {
    console.log("michel envoyé");
    res.send("M I C H E L");
});

app.get("/getIp", async (req, res) => {
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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
