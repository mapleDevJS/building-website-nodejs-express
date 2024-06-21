const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const FeedbackService = require('./services/FeedbackService');
const SpeakerService = require('./services/SpeakerService');
const routes = require('./routes');

const app = express();
const PORT = 3000;
const TRUST_PROXY_SETTING = 1;
const SESSION_NAME = 'session';
const SESSION_KEYS = ['kshHKHf8hdkndk', 'kshdfkhHhfqjwpkpeurU'];
const VIEWS_PATH = path.join(__dirname, './views');
const STATIC_PATH = path.join(__dirname, './static');

// Services
const feedbackService = new FeedbackService('./data/feedback.json');
const speakerService = new SpeakerService('./data/speakers.json');

// Config settings
app.set('trust proxy', TRUST_PROXY_SETTING);
app.set('view engine', 'ejs');
app.set('views', VIEWS_PATH);

// Middlewares
app.use(cookieSession({
    name: SESSION_NAME,
    keys: SESSION_KEYS,
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(STATIC_PATH));
app.locals.siteName = 'ROUX Meetups';

// Async middleware
async function setSpeakerNames(request, response, next) {
    try {
        const names = await speakerService.getNames();
        response.locals.speakerNames = names;
        next();
    } catch (err) {
        next(err);
    }
}
app.use(setSpeakerNames);

// Main routes
app.use('/', routes({feedbackService, speakerService}));

// Error handling
app.use((request, response, next) => {
    next(createError(404, 'File not found'));
});
app.use((err, request, response, next) => {
    response.locals.message = err.message;
    console.log(err);
    const status = err.status || 500;
    response.locals.status = status;
    response.status(status);
    response.render('error');
});

// Server startup
app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}!`);
});
