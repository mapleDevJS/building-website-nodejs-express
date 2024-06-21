const express = require('express');

const router = express.Router();

const renderPage = (response, next, pageTitle, template, data) => {
  try {
    return response.render('layout', {
      pageTitle,
      template,
      ...data,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = ({ speakerService }) => {
  router.get('/', async (req, res, next) => {
    try {
      const [artwork, speakers] = await Promise.all([
        speakerService.getAllArtwork(),
        speakerService.getList(),
      ]);
      renderPage(res, next, 'Speakers', 'speakers', { speakers, artwork });
    } catch (err) {
      next(err);
    }
  });

  router.get('/:shortname', async (req, res, next) => {
    const { shortname } = req.params;
    try {
      const [speaker, artwork] = await Promise.all([
        speakerService.getSpeaker(shortname),
        speakerService.getArtworkForSpeaker(shortname),
      ]);
      renderPage(res, next, 'Speakers', 'speakers-detail', { speaker, artwork });
    } catch (err) {
      next(err);
    }
  });

  return router;
};
