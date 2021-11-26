const express = require('express');
const app = express();

app.get('/', (req, res) => {
res.send('Hello Ilyes i <3');
});


// Preparing for hosting envirement, support of dynamic port, if none => use 3000
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));