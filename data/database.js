const mongodb = require("mongodb");

let database;

async function connectToDatabase() {
  const mongoclient = await mongodb.MongoClient.connect("mongodb://0.0.0.0:27017");
  database = mongoclient.db("blog");
}

function getDb() {
  if (!database) {
    throw {message: "데이터베이스에 연결해 주세요!"};
  }
  return database;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb
}