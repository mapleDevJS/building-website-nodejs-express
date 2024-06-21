const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const ENCODING = 'utf8';

/**
 * Logic for reading and writing feedback data
 */
class FeedbackService {
  /**
   * Constructor
   * @param {string} dataFile Path to a JSON file that contains the feedback data
   */
  constructor(dataFile) {
    this.dataFile = dataFile;
  }

  /**
   * Get all feedback items
   * @returns {Promise<Array>} List of feedback items
   */
  async getList() {
    return this.getData();
  }

  /**
   * Add a new feedback item
   * @param {string} name The name of the user
   * @param {string} email The email of the user
   * @param {string} title The title of the feedback message
   * @param {string} message The feedback message
   * @returns {Promise<void>}
   */
  async addEntry(name, email, title, message) {
    const data = await this.getData();
    data.unshift({ name, email, title, message });
    await this.saveData(data);
  }

  /**
   * Fetches feedback data from the JSON file provided to the constructor
   * @returns {Promise<Array>} The feedback data
   */
  async getData() {
    const data = await readFile(this.dataFile, ENCODING);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Saves feedback data to the JSON file
   * @param {Array} data The feedback data
   * @returns {Promise<void>}
   */
  async saveData(data) {
    await writeFile(this.dataFile, JSON.stringify(data));
  }
}

module.exports = FeedbackService;
