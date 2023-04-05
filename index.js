const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Allow cross-origin requests
app.use(cors());

// Parse incoming request bodies in a middleware before the handlers
app.use(bodyParser.json());

// In-memory store for webhook data
let webhookData = {};

app.get('/', (req, res) => {
  res.send('Server is working!'); // Send a response to the client
});

app.get('/getData/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`Client requested data for ID ${id}`);
  
    // Check if there is any data in the webhookData object for the requested ID
    if (webhookData[id]) {
      // Send the data to the client
      res.status(200).json(webhookData[id]);
  
    } else {
      // If there is no data, send a 404 error to the client
      res.sendStatus(404);
    }
  });

// Handle incoming webhook data
app.post('/webhook', async (req, res) => {
  console.log('Webhook data received:', req.body);

  const id = req.body.originatingMessageId;

  if (!webhookData[id]) {
    webhookData[id] = [];
  }
  webhookData[id].push(req.body);

  res.sendStatus(200);
});

// Start the server
app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
