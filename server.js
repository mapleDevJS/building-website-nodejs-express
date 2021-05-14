const express = require('express');

const app = express();

const PORT = 3000;

app.get('/', (request, response) => {
    response.send('Hello Express :)');
});

app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}!`);
});
