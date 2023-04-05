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
  res.send('Server is ON!'); // Send a response to the client
});

// Handle incoming requests for data with a specific ID
app.get('/getData/:id', async (req, res) => {
  res.send("hello")
  const id = req.params.id;
  console.log(`Client requested data for ID ${id}`);

  // Check if there is any data in the webhookData object for the requested ID
  if (webhookData[id]) {
    // Send the data to the client
    res.status(200).json(webhookData[id]);

    // Remove the data from the webhookData object
    delete webhookData[id];
  } else {
    // If there is no data, wait for the webhook to receive it
    let dataPromise = new Promise(resolve => {
      const intervalId = setInterval(() => {
        if (webhookData[id]) {
          clearInterval(intervalId);
          resolve(webhookData[id]);

          // Remove the data from the webhookData object
          delete webhookData[id];
        }
      }, 1000);
    });

    // Wait for the data and then send it to the client
    try {
      const data = await dataPromise;
      res.status(200).json(data);
    } catch (error) {
      // If there is still no data after 2 minutes, send a 404 error to the client
      res.sendStatus(404);
    }
  }
});

// Handle incoming webhook data
app.post('/webhook', async (req, res) => {
  console.log('Webhook data received:', req.body);

  // Add the incoming data to the webhookData object
  if (!webhookData[req.body.id]) {
    webhookData[req.body.id] = [];
  }

  webhookData[req.body.id].push(req.body);

  res.sendStatus(200);
});

// Start the server
app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
