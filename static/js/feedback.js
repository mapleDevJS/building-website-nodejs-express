$(function feedback() {
  const $feedbackStatus = $('.feedback-status');
  const $feedbackForm = $('.feedback-form');
  const $feedbackItems = $('.feedback-items');

  /**
   * Generates HTML for feedback items
   * @param {Array} feedback Array of feedback items
   * @returns {string} HTML string for feedback items
   */
  function generateFeedbackHtml(feedback) {
    return feedback
      .map(
        (item) => `
      <div class="feedback-item item-list media-list">
        <div class="feedback-item media">
          <div class="feedback-info media-body">
            <div class="feedback-head">
              <div class="feedback-title">${item.title}</div>
              <small>by ${item.name}</small>
            </div>
            <div class="feedback-message">${item.message}</div>
          </div>
        </div>
      </div>
    `
      )
      .join('\n');
  }

  /**
   * Generates HTML for error messages
   * @param {Array} errors Array of error messages
   * @returns {string} HTML string for error messages
   */
  function generateErrorHtml(errors) {
    return errors.map((error) => `<li>${error.msg}</li>`).join('\n');
  }

  /**
   * Renders feedback or error messages to the DOM
   * @param {*} data XHR result
   */
  function renderFeedback(data) {
    $feedbackStatus.empty();

    if (!data.errors && data.feedback) {
      $feedbackForm.trigger('reset');
      $feedbackItems.html(generateFeedbackHtml(data.feedback));
      $feedbackStatus.html(`<div class="alert alert-success">${data.successMessage}</div>`);
    } else if (data.errors) {
      $feedbackStatus.html(
        `<div class="alert alert-danger"><ul>${generateErrorHtml(data.errors)}</ul></div>`
      );
    }
  }

  /**
   * Attaches to the form and sends the data to our REST endpoint
   */
  $feedbackForm.submit(function submitFeedback(e) {
    e.preventDefault();
    $.post(
      '/feedback/api',
      {
        name: $('#feedback-form-name').val(),
        email: $('#feedback-form-email').val(),
        title: $('#feedback-form-title').val(),
        message: $('#feedback-form-message').val(),
      },
      renderFeedback
    );
  });
});
