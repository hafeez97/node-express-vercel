const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Allow cross-origin requests
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

// Parse incoming request bodies in a middleware before the handlers
app.use(bodyParser.json());

// In-memory store for webhook data and their timeouts
let webhookData = {};



// Handle incoming requests for data with a specific ID
app.get('/getData/:id', async (req, res) => {
  const id = req.params.id;
  console.log(`Client requested data for ID ${id}`);

  // Check if there is any data in the webhookData object for the requested ID
  if (webhookData[id]) {
    // Send the data to the client
    res.status(200).json(webhookData[id]);

    // Remove the data from the webhookData object
    delete webhookData[id];
  } else {
    // If there is no data, wait up to 2 minutes for it to become available
    let timeout = 2 * 60 * 1000;
    let interval = 1000;
    let elapsed = 0;
    let timer = setInterval(() => {
      if (webhookData[id]) {
        // Send the data to the client
        res.status(200).json(webhookData[id]);

        // Remove the data from the webhookData object
        delete webhookData[id];

        // Stop the timer
        clearInterval(timer);
      } else {
        elapsed += interval;
        if (elapsed >= timeout) {
          // Timeout occurred, send a 404 error to the client
          res.sendStatus(404);

          // Stop the timer
          clearInterval(timer);
        }
      }
    }, interval);
  }
});


// // Handle incoming requests for data with a specific ID
// app.get('/getData/:id', async (req, res) => {
//   const id = req.params.id;
//   console.log(`Client requested data for ID ${id}`);

//   // Check if there is any data in the webhookData object for the requested ID
//   if (webhookData[id]) {
//     // Send the data to the client
//     res.status(200).json(webhookData[id]);

//     // Keep the data in the webhookData object, so it can be requested again if needed
//   } else {
//     // If there is no data, send a 404 error to the client
//     res.sendStatus(404);
//   }
// });

// Handle incoming webhook data
app.post('/webhook', async (req, res) => {
  console.log('Webhook data received:', req.body);

  // Extract the ID from the incoming data object
  const id = req.body.originatingMessageId;

  // Add the incoming data to the webhookData object
  if (!webhookData[id]) {
    webhookData[id] = [];
  }

  webhookData[id].push(req.body);

  // Set a timeout to delete the data after 5 minutes
  setTimeout(() => {
    delete webhookData[id];
  }, 5 * 60 * 1000);

  res.sendStatus(200);
});

// Start the server
app.listen(3001, () => {
  console.log('Server listening on port 3001');
});