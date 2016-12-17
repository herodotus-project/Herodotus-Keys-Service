const debug = require('debug')('bin:lib:auth');
const basicAuth = require('basic-auth');
const keys = require('./keys');

if(process.env.BASIC_AUTH_USERNAME === undefined || process.env.BASIC_AUTH_PASSWORD === undefined){
	debug(`Basic auth requirements not met. Exiting.`);
	process.exit();
}

module.exports = function(req, res, next){

	const creds = basicAuth(req);

	if(req.query.token !== undefined){
		keys.check(req.query.token)
			.then(tokenIsValid => {
				if(tokenIsValid){
					next();
				} else {
					res.status(401);
					res.send('Invalid token');
				}
			})
			.catch(err => {
				res.status(401);
				res.send('Invalid token');
			})
		;
	} else if (!creds || creds.name !== process.env.BASIC_AUTH_USERNAME || creds.pass !== process.env.BASIC_AUTH_PASSWORD) {
		res.status(401);
		res.setHeader('WWW-Authenticate', 'Basic realm="Herodotus Keys Service"');
		res.end('Access denied');
		return false
	} else {
		next();
	}

}