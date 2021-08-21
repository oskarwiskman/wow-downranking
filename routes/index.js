var express = require('express');
var fs = require('fs');
var router = express.Router();

router.get('/', function(req, res, next) {
    // Check the user-agent string to identyfy the device.
  var ua = req.header('user-agent');
  if(/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile|ipad|android|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(ua)) {
  		res.render('mobile_index', { title: "Ozgar's Downranking Guide & Tool - World of Warcraft Classic" });
  } else {
  		res.render('index', { title: "Ozgar's Downranking Guide & Tool - World of Warcraft Classic" });
  }
});

router.get('/tbc', function(req, res, next) {
  var ua = req.header('user-agent');
  if(/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile|ipad|android|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(ua)) {
  		res.render('mobile_index_tbc', { title: "Ozgar's Downranking Guide & Tool - The Burning Crusade Classic" });
  } else {
  		res.render('index_tbc', { title: "Ozgar's Downranking Guide & Tool - The Burning Crusade Classic" });
  }
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
