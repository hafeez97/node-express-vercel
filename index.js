// Import packages
const express = require("express");
// const home = require("./routes/home");

// Middlewares
const app = express();
app.use(express.json());

// Routes
// app.use("/home", home);

app.get('/', (req, res) => {
    res.send('Webhook App is running!');
});

app.post('/webhook', (req, res) => {
    console.log('Received a webhook request:', req.body);
    // handle the webhook request here
    console.log(req.body);
    res.sendStatus(200);
});

// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
