var express = require("express");
var router = express();
var mongo = require("mongodb");
var MongoClient = require("mongodb").MongoClient;
var bodyParser = require("body-parser");
var db;

router.use(bodyParser.json({ limit: "50mb", extended: true })); // to support JSON-encoded bodies

// Initialize connection once
MongoClient.connect(
  "mongodb://localhost:27017/",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) throw err;
    db = client.db("rss_fbit_db");
  }
);

// get all entries from news-discarded in a daterange
router.get("/entries/yearmonth/:yearmonth", (req, res) => {
  queryMonth = req.params.yearmonth.split("-")[1];
  queryYear = req.params.yearmonth.split("-")[0];
  var startDate = new Date(parseInt(queryYear), parseInt(queryMonth) - 1, 1);
  var endDate = new Date(parseInt(queryYear), parseInt(queryMonth), 1);
  var collection = db.collection("news_discarded");
  collection
    .find(
      {
        published: {
          $gte: startDate,
          $lt: endDate,
        },
      },
      {
        _id: 1,
        published: 1,
        extraction_date: 1,
        brand: 1,
        title: 1,
        topics: 1,
        link: 1,
        summary: 1,
        description: 1,
        section: 1,
        source_id: 1,
        source_name: 1,
      }
    )
    .sort({ published: -1 })
    .toArray((err, docs) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        res.json({ results: docs });
      }
    });
});

// Add route without parameters
router.route("/news-discarded").post((req, res) => {
  var news_collection = db.collection("news");
  var news_discarded_collection = db.collection("news_discarded");
  req.body.forEach(id => {
    var o_id = new mongo.ObjectID(id);
    news_collection.find({ _id: o_id },{}).toArray((err, news_doc) => {
      if (err) {
        console.log("error: " + err);
        res.status(500).send(err);
      } else {
        news_discarded_collection.insertOne(news_doc[0], function (err, results) {
          // console.log("Inserting in news discarded" + JSON.stringify(news_doc[0]))
          if (err) {
            console.log(err);
            res.status(500).send(err);
          } else {
            console.log("Result: " + results)
          }
        });
      }
    });
  });
  res.json({ success: req.body});
});

// Add route with parameters and different CRUD operations (GET, DELETE and PUT)
router
  .route("/identifier/:documentId")
  .get((req, res) => {
    var o_id = new mongo.ObjectID(req.params.documentId);

    var collection = db.collection("news_discarded");
    collection.find({ _id: o_id }).toArray((err, docs) => {
      if (err) {
        console.log("error: " + err);
        res.status(500).send(err);
      } else {
        res.json({ results: docs });
      }
    });
  })
  .delete((req, res) => {
    var collection = db.collection("news_discarded");
    var query = { _id: new mongo.ObjectID(req.params.documentId) };
    collection.deleteOne(query, function (err, results) {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        res.json({ success: req.params.documentId });
      }
    });
  });

// ######## UPDATE TOPICS ##############
// Add route with parameters and different CRUD operations (GET, DELETE and PUT)
router.route("/identifier/:documentId/topics/:topics").put((req, res) => {
  var collection = db.collection("news_discarded");
  var query = { _id: new mongo.ObjectID(req.params.documentId) };
  var topicsToAssign =
    req.params.topics == " " ? "void_topics_string" : req.params.topics;
  var updatedTopics =
    topicsToAssign === "void_topics_string"
      ? { $unset: { topics: "" } }
      : { $set: { topics: topicsToAssign } };

  collection.updateOne(query, updatedTopics, function (err, results) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.json({ success: req.params.documentId });
    }
  });
});

// // TODO: add timeout to responses:
// // https://stackoverflow.com/questions/21708208/express-js-response-timeout
// // So far we have added a timeout to the whole cron job, but not to the responses of every API call.

module.exports = router;
