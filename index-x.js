// Import packages
const express = require("express");
const socketIO = require('socket.io');
const cors = require('cors');
const http = require('http');
const server = http.createServer();


// Middlewares
const app = express();
app.use(express.json());




app.get('/', (req, res) => {
    res.send('Webhook App is running!');
});

app.post('/webhook', (req, res) => {
    console.log('Received a webhook request:', req.body);
    // handle the webhook request here
    return res.body;
    res.sendStatus(200);
});





// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
