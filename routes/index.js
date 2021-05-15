const express = require('express');

const speakersRoute = require('./speakers');
const feedbackRoute = require('./feedback');

const router = express.Router();

module.exports = (params) => {
  const { speakerService } = params;

  router.get('/', async (request, response, next) => {
    try {
      const artwork = await speakerService.getAllArtwork();
      const topSpeakers = await speakerService.getList();
      return response.render('layout', { pageTitle: 'Welcome', template: 'index', topSpeakers, artwork });
    } catch(err) {
      return next(err);
    }
  });

  router.use('/speakers', speakersRoute(params));
  router.use('/feedback', feedbackRoute(params));

  return router;
};
