const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const createError = require('http-errors');

const FeedbackService = require('./services/FeedbackService');
const SpeakerService = require('./services/SpeakerService');

const feedbackService = new FeedbackService('./data/feedback.json');
const speakerService = new SpeakerService('./data/speakers.json');

const routes = require('./routes');

const app = express();

const PORT = 3000;

app.set('trust proxy', 1);

app.use(cookieSession({
    name: 'session',
    keys: ['kshHKHf8hdkndk', 'kshdfkhHhfqjwpkpeurU'],
}))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.locals.siteName = 'ROUX Meetups';

app.use(express.static(path.join(__dirname, './static')));

// available for the whole application
app.use(async (request, response, next) => {
    try {
        const names = await speakerService.getNames();
        response.locals.speakerNames = names;
        return next();
    } catch (err) {
        return next(err);
    }
});

app.use('/', routes({feedbackService, speakerService}));

app.use((request, response, next) => {
    return next(createError(404, 'File not found'));
});

app.use((err, request, response, next) => {
    response.locals.message = err.message;
    console.log(err);
    const status = err.status || 500;
    response.locals.status = status;
    response.status(status);
    response.render('error');
});

app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}!`);
});
