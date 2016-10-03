const debug = require('debug');
const api = require('../util/ooyala');

const print = debug('v4demo');

function parseChapterInfo(chapterInfo) {
  const offsets = [];
  Object.keys(chapterInfo).forEach(key => {
    const offset = Number.parseInt(key, 10);
    if (Number.isInteger(offset)) {
      offsets.push(offset);
    }
  });
  return offsets.sort((a, b) => {
    return a < b ? -1 : (a > b ? 1 : 0);
  }).map(offset => {
    const offsetStr = String(offset);
    return {[offsetStr]: chapterInfo[offsetStr]};
  });
}

module.exports = {
  getChapters(embedCode) {
    return api.get(`/v2/assets/${embedCode}/metadata`)
    .then(chapterInfo => {
      print(`Custom metadata for ${embedCode} retrieved: ${chapterInfo}`);
      return parseChapterInfo(chapterInfo);
    })
    .then(chapters => {
      return api.get(`/v2/assets/${embedCode}/generated_preview_images`)
      .then(images => {
        print(`Thumbnails for ${embedCode} retrieved: ${images}`);
        for (image of images) {
          const offset = image.time;
          for (let i = 0; i < chapters.length; i++) {
            const chapter = chapters[i];
            if (offset in chapter) {
              const title = chapter[offset];
              image.title = title;
              chapters[i] = image;
              break;
            }
          }
        }
        return chapters;
      });
    });
  }
};
