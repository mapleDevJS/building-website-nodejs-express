const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

class SpeakerService {
  constructor(datafile) {
    this.datafile = datafile;
  }

  async getNames() {
    const data = await this.getData();
    return data.map(({ name, shortname }) => ({ name, shortname }));
  }

  async getAllArtwork() {
    const data = await this.getData();
    return data.reduce((acc, { artwork }) => artwork ? [...acc, ...artwork] : acc, []);
  }

  async getArtworkForSpeaker(shortname) {
    const speaker = await this.findSpeaker(shortname);
    return speaker?.artwork || null;
  }

  async getSpeaker(shortname) {
    const speaker = await this.findSpeaker(shortname);
    if (!speaker) return null;
    const { title, name, shortname: sn, description } = speaker;
    return { title, name, shortname: sn, description };
  }

  async getListShort() {
    const data = await this.getData();
    return data.map(({ name, shortname, title }) => ({ name, shortname, title }));
  }

  async getList() {
    const data = await this.getData();
    return data.map(({ name, shortname, title, summary }) => ({ name, shortname, title, summary }));
  }

  async findSpeaker(shortname) {
    const data = await this.getData();
    return data.find(speaker => speaker.shortname === shortname);
  }

  async getData() {
    const data = await readFile(this.datafile, 'utf8');
    return JSON.parse(data).speakers;
  }
}

module.exports = SpeakerService;
