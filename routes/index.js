const express = require('express');
const speakersRoute = require('./speakers');
const feedbackRoute = require('./feedback');

module.exports = (config) => {
  const { speakerService } = config;
  const router = express.Router();

  async function getHomePageData() {
    const artwork = await speakerService.getAllArtwork();
    const topSpeakers = await speakerService.getList();
    return { artwork, topSpeakers };
  }

  router.get('/', async (request, response, next) => {
    try {
      const { artwork, topSpeakers } = await getHomePageData();
      return response.render('layout', {
        pageTitle: 'Welcome',
        template: 'index',
        topSpeakers,
        artwork,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.use('/speakers', speakersRoute(config));
  router.use('/feedback', feedbackRoute(config));

  return router;
};
