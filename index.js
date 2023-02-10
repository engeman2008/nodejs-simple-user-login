const express = require("express");
const { uuid } = require("uuidv4");
var loadash = require("lodash");
const { json } = require("express");

const app = express();
app.use(express.json());

let users = [];
let tokens = [];

app.post("/api/user", (req, res, next) => {
  if (req.body === null) {
    return res.status(400).send();
  }
  const user = {
    user_id: req.body.user_id,
    login: req.body.login,
    password: req.body.password,
  };
  const index = loadash.findIndex(users, (ob) => {
    return ob.user_id === req.body.user_id || ob.login === req.body.login;
  });
  if (index !== -1) return res.status(409).send();
  users = loadash.concat(users, user);
  console.log(users);
  res.status(201).send();
});
app.post("/api/authenticate", (req, res, next) => {
  if (req.body === null) {
    return res.status(400).send();
  }
  const index = loadash.findIndex(users, (ob) => {
    return ob.login === req.body.login;
  });
  if (index === -1) return res.status(404).send();
  const user = loadash.nth(users, index);
  if (user.password !== req.body.password) return res.status(401).send();

  const token = uuid();
  tokens.push({ user_id: user.user_id, token: token });
  return res.status(200).json({ token });
});
app.post("/api/logout", (req, res, next) => {
  const header = req.headers.authorization;
  const token = header.split(" ").pop();
  const index = loadash.findIndex(tokens, (ob) => {
    return ob.token === token;
  });
  if (index === -1) return res.status(401).send();
  tokens = loadash.dropRightWhile(tokens, ["token", token]);
  return res.status(200).send();
});
app.post("/api/articles", (req, res, next) => {});
app.get("/api/articles", (req, res, next) => {});

app.listen(3000, () => {
  console.log("started");
});
