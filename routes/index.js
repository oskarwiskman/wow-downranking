var express = require('express');
var fs = require('fs');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: "Ozgar's Downranking Guide & Tool" });
});

router.get('/tbc', function(req, res, next) {
  res.render('tbc_index_wip', { title: "Ozgar's Downranking Guild & Tool - The Burning Crusade" });
});

router.get('/cookieinfo', function(req, res, next) {
  res.render('cookieinfo', { title: 'Cookie information' });
});

router.get('/spelldata/*', function(req, res, next) {
	fs.readdir("./assets/" + req.path, (err, data) => {
		res.send(data);
	});
});

router.get('/data/*', function(req, res, next) {
	fs.readdir("./assets/" + req.path, (err, data) => {
		res.send(data);
	});
});

router.get('/talents/*', function(req, res, next) {
	fs.readdir("./assets/" + req.path, (err, data) => {
		res.send(data);
	});
});

router.get('/buffs/*', function(req, res, next) {
	fs.readdir("./assets/" + req.path, (err, data) => {
		res.send(data);
	});
});


module.exports = router;
