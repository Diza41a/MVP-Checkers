// const fs = require('fs');
// const { v4: uuidv4 } = require('uuid');
const path = require('path');
const express = require('express');

const app = express();
// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// Request variables
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on  http://localhost:${port}`);
});
