const express = require("express");
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.initialize();

client.on("qr", (qr) => {
  // NOTE: This event will not be fired if you are authenticated.
  console.log("----------QR RECEIVED---------");
  qrcode.generate(qr, { small: true });
  app.get("/getqr", (req, res, next) => {
    res.send({ qr });
  });
});

client.on("auth_failure", (msg) => {
  // Fired if session restore was unsuccessfull
  console.error("AUTHENTICATION FAILURE", msg);
});

client.on("ready", () => {
  console.log("YOU ARE READY TO SEND MESSAGES");
});

app.post("/sendmessage", async (req, res, next) => {
  try {
    console.log(req.body);
    const { number, message } = req.body; // Get the body
    const msg = await client.sendMessage(`${number}@c.us`, message); // Send the message
    res.status(200).send({ msg }); // Send the response
  } catch (error) {
    res.status(500).send(error);
  }
});

// Listening for the server
const PORT = 3000;

app.listen(PORT, () =>
  console.log(`Server Listening 🚀 @ http://localhost:${PORT}`)
);
