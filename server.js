const { response } = require('express');
const express = require('express');
const path = require('path');
const routes = require('./routes');

const app = express();

const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(express.static(path.join(__dirname, './static')));

app.use('/', routes());

app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}!`);
});