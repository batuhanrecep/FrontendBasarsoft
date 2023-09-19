const express = require('express');
const app = express();
const port = 4444;
const cors = require('cors')
const corsOptions = {
    origin: 'http://localhost:4444', // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));
// Enable CORS for specific origins (e.g., http://localhost:4444)

// Serve static files (HTML, CSS, JavaScript)
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
