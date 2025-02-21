require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 4000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors())
app.use(express.json());

// SCIC-job-task
// IolvelTK8DpzhgkT




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.47f5u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const userCollection = client.db('ScicJobTask').collection('user');
    const taskCollection = client.db('ScicJobTask').collection('task');

    // task

    app.get('/task', async (req, res) => {
      const cursor = taskCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get("/task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await taskCollection.findOne(query)
      res.send(result)
    })

    app.delete('/task/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await taskCollection.deleteOne(query)
      res.send(result)
    })

    app.put('/task/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const option = { upsert: true };
      const updateTask = req.body;
      const task = {
        $set: {
          title: updateTask.title,
          category: updateTask.category,
          description: updateTask.description,
          timestamp: new Date().toLocaleString()
        }
      }
      const result = await taskCollection.updateOne(filter, task, option)
      res.send(result)
    })


    app.post('/task', async (req, res) => {
      const newTask = req.body;
      const result = await taskCollection.insertOne(newTask)
      res.send(result)
    })

    


    // user

    app.get('/user', async (req, res) => {
      const cursor = userCollection.find()
      const result = await cursor.toArray()
      res.send(result)

    })

    app.post('/user', async (req, res) => {
      const newUsers = req.body;
      const result = await userCollection.insertOne(newUsers)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Khandaker Mohyet Work Station')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})