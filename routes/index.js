const express = require('express');
const debug = require('debug');
const discovery = require('../models/discovery');

const router = express.Router();
const print = debug('vidcom');

router.get('/', (req, res) => {
  print(`/ called`);

  if (!req.session.isAuthenticated) {
    res.redirect('/auth');
    return;
  }

  discovery.getTrends().then(assets => {
    res.render('index', {assets});
  }).catch(err => {
    res.render('error', {err});
  });
});

module.exports = router;
