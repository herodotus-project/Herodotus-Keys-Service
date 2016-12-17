const debug = require('debug')('routes:index');
const express = require('express');
const router = express.Router();

const auth = require('../bin/lib/auth');
const keys = require('../bin/lib/keys');

router.post('/check', function(req, res, next) {
	keys.check(req.body.key)
		.then(isValid => {
			if(isValid){
				res.status(200);
			} else {
				res.status(498);
			}			
			res.end();
		})
		.catch(err => {
			res.status(400);
			res.end();
		})
	;
});


// Every other action needs to be authorised
router.use(auth);

router.get('/', function(req, res, next) {
	res.render('index', { title: 'Herodotus Keys Service' });
});

router.get('/generate', function(req, res, next) {
	res.render('generate', { title: 'Generate a key' });
});

router.post('/create', function(req, res, next) {

	debug(req.body);
	debug(req.query.token);
	
	keys.create(req.body.name, req.body.description)
		.then(key => {
			if(req.query.token !== undefined){
				res.send(key);
			} else {
				res.render('present', { 
					title: 'Key generated',
					key 
				});
			}

		})
		.catch(err => {
			debug(err);
			res.status(500);
			res.end();
		})
	;

});

router.get('/revoke', function(req, res) {
	res.render('revoke', { title: 'Revoke a key' });
});

router.post('/revoke', function(req, res){

	keys.destroy(req.body.key)
		.then(result => {

			if(req.query.token !== undefined){
				res.end();
			} else {
				res.render('message', {
					title : 'Token revoked',
					body : 'The token has been successfully revoked'
				});
			}

		})
		.catch(err => {
			debug(err);
			res.status(500);
			res.render('err', {
				message : `An error occurred while your key was being revoked. It may still be valid.`
			});
		})
	;

});

router.get('/documentation', function(req, res, next){

	res.render('documentation', {
		title : 'Documentation'
	})

});

module.exports = router;
