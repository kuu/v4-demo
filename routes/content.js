const express = require('express');
const debug = require('debug');
const config = require('config');
const assets = require('../models/assets');

const router = express.Router();
const print = debug('v4demo');

router.get('/:id', (req, res) => {
  const embedCode = req.params.id;

  print(`/content/${embedCode} called`);

  if (!req.session.isAuthenticated) {
    print('Not authed. Redirect');
    res.redirect('/auth');
    return;
  }
  assets.getChapters(embedCode)
  .then(chapters => {
    const {pcode, id, version} = config.player;
    let chaptersJson;
    try {
      chaptersJson = JSON.stringify(chapters);
    } catch (err) {
      console.log(`${err.message} ${err.stack}`);
      chaptersJson = '[]';
    }
    res.render('content', {embedCode, pcode, id, version, chapters: chaptersJson});
  });
});

module.exports = router;
