const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();

const validations = [
  check('name').trim().isLength({ min: 3 }).escape().withMessage('A name is required'),
  check('email').trim().isEmail().normalizeEmail().withMessage('A valid email address is required'),
  check('title').trim().isLength({ min: 3 }).escape().withMessage('A title is required'),
  check('message').trim().isLength({ min: 5 }).escape().withMessage('A message is required'),
];

module.exports = (params) => {
  const { feedbackService } = params;

  const handleFeedback = async (req, res, next, isApi = false) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorData = { errors: errors.array() };
        if (isApi) {
          return res.json(errorData);
        }
        req.session.feedback = errorData;
        return res.redirect('/feedback');
      }

      const { name, email, title, message } = req.body;
      await feedbackService.addEntry(name, email, title, message);

      if (isApi) {
        const feedback = await feedbackService.getList();
        return res.json({ feedback, successMessage: 'Thank you for your feedback!' });
      }

      req.session.feedback = { message: 'Thank you for your feedback!' };
      return res.redirect('/feedback');
    } catch (err) {
      return next(err);
    }
  };

  router.get('/', async (req, res, next) => {
    try {
      const feedback = await feedbackService.getList();
      const { feedback: feedbackSession } = req.session;
      req.session.feedback = {};

      return res.render('layout', {
        pageTitle: 'Feedback',
        template: 'feedback',
        feedback,
        errors: feedbackSession?.errors || false,
        successMessage: feedbackSession?.message || false,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.post('/', validations, (req, res, next) => handleFeedback(req, res, next));
  router.post('/api', validations, (req, res, next) => handleFeedback(req, res, next, true));

  return router;
};
