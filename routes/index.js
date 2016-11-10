const debug = require('debug')('routes:index');
const express = require('express');
const router = express.Router();

const keys = require('../bin/lib/keys');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Herodotus Keys Service' });
});

router.get('/generate', function(req, res, next) {
	res.render('generate', { title: 'Generate a key' });
});

router.post('/check', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.post('/create', function(req, res, next) {

	debug(req.body);
	
	keys.create(req.body.name, req.body.description)
		.then(key => {
			res.send(key);
		})
		.catch(err => {
			res.status(500);
			res.end();
		})
	;

});

router.get('/revoke', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

module.exports = router;
