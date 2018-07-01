// Connect to the db
var mongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;

mongoClient.connect("mongodb://localhost:17017/esic_chat")
    .then(conn => global.conn = conn.db("esic_chat"))
    .catch(err => console.log(err))

function findAll(callback) {
    global.conn.collection("atendimentos").find({}).toArray(callback);
}

// Create atendimento
function registerAtendimento(atendimento, callback) {
    global.conn.collection("atendimentos").insert(atendimento, callback);
}

// Push message
function registerAtendimentoMessage(id, message) {

    global.conn.collection("atendimentos").updateOne(
        { "_id": id },
        {
            $push: {
                "messages": {
                    created_at: Date(),
                    author: message.author,
                    content: message.content
                }
            }
        },
        { upsert: true }
    );
}


// Find specific document by _id
function findSpecificAtendimento(id, callback) {
    // global.conn.collection("atendimentos").find({ _id: id })
    global.conn.collection("atendimentos").find(id).toArray(callback)
}



function findOne(id, callback) {
    global.conn.collection("atendimentos").find(new ObjectId(id)).toArray(callback);
}

function update(id, message, callback) {
    // global.conn.collection("atendimentos").updateOne({ _id: new ObjectId(id) }, atendimento, callback);
    global.conn.collection("atendimentos").updateOne(
        { $set: { "_id": id, "messages": message } },
        { upsert: true }
    );
}

module.exports = { registerAtendimento, registerAtendimentoMessage, findSpecificAtendimento }

