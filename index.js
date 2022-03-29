const express = require('express');
const api = require('./routes/routes');

require('dotenv').config();

const app = express();
const PORT = process.env.URL_PORT;
const URL = process.env.URL;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', api);

app.listen(PORT, () => console.log(`Server running on port: ${URL}:${PORT}`));