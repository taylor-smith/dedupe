"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const _flatten = require("lodash.flatten");
const _uniq = require("lodash.uniq");
const MongoClient = require("mongodb").MongoClient;
const dao = require("./dao");
require("dotenv").config();

// Constants
const dbName = "dedupe";

MongoClient.connect(process.env.MONGODB_URL, (err, client) => {
  console.log(client);
  // App
  if (err) console.error(err);
  const db = client.db(dbName);
  const app = express();
  app.use(bodyParser.json({ limit: "1mb" }));

  app.get("/", (req, res) => {
    console.log(mongoDb);
    res.send(
      dao.getLists({
        db
      })
    );
  });

  app.post("/create", (req, res) => {
    const list = req.body.list;
    const name = req.body.name;
    dao.createList({ db, list, name });
    res.send(list);
  });

  app.post("/dedupe", async (req, res) => {
    const names = req.body.names;
    if (!names) console.error("Must supply a name to return dedupe lists");
    const listObjs = await dao.getListsByNames({ db, names });
    const lists = listObjs.reduce((arr, list) => {
      arr.push(_flatten(list.list));
      return arr;
    }, []);
    const flattenedList = _flatten(lists);
    const uniquedList = _uniq(flattenedList);
    res.send({
      uniquedList
    });
  });

  app.listen(PORT, HOST);
  console.log(`Running on http://${HOST}:${PORT}`);
});
