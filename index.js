const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zdityrz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const taskCollection = client.db("TaskManagementDB").collection("tasks");

    // all Tasks
    app.post("/tasks", async (req, res) => {
      const taskData = req?.body;
      const result = await taskCollection.insertOne(taskData);
      res.send(result);
    });
    app.get("/allTasks", async (req, res) => {
      const email = req?.query?.email;
      const query = { email: email };
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/tasks", async (req, res) => {
      const email = req?.query?.email;
      const status = req?.query?.status;
      const query = { email: email, status: status };
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    });
    app.patch("/tasks/:id", async (req, res) => {
      const updatedTaskData = req?.body;
      const id = req?.params?.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          email: updatedTaskData?.email,
          title: updatedTaskData?.title,
          description: updatedTaskData?.description,
          date: updatedTaskData?.date,
          priority: updatedTaskData?.priority,
          status: updatedTaskData?.status,
        },
      };
      const result = await taskCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });
    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });
    app.put("/tasks/:id", async (req, res) => {
      const updated = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const upsert = { upsert: true };
      const updatedDoc = {
        $set: {
          status: updated.status,
        },
      };
      const result = await taskCollection.updateOne(query, updatedDoc, upsert);
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Task is processing");
});

app.listen(port, () => {
  console.log(`Task Management is running on port ${port}`);
});
