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

router.post('/create', function(req, res, next) {

	debug(req.body);
	
	keys.create(req.body.name, req.body.description)
		.then(key => {
			// res.send(key);
			res.render('present', { 
				title: 'Key generated',
				key 
			});
		})
		.catch(err => {
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
			res.render('message', {
				title : 'Token revoked',
				body : 'The token has been successfully revoked'
			});
		})
		.catch(err => {
			debug(err);
			res.status(500);
			res.json(err);
			// res.render('err', {
			// 	message : `An error occurred while your key was being revoked. It may still be valid.`
			// })
		})
	;

})

module.exports = router;
