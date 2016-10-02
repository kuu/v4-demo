const express = require('express');
const debug = require('debug');
const config = require('config');

const router = express.Router();
const print = debug('vidcom');

router.get('/:id', (req, res) => {
  const embedCode = req.params.id;

  print(`/content/${embedCode} called`);

  if (!req.session.isAuthenticated) {
    print('Not authed. Redirect');
    res.redirect('/auth');
    return;
  }
  const {pcode, id, version} = config.player;
  res.render('content', {embedCode, pcode, id, version});
});

module.exports = router;
