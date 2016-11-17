const debug = require('debug')('bin:lib:auth');
const basicAuth = require('basic-auth');

if(process.env.BASIC_AUTH_USERNAME === undefined || process.env.BASIC_AUTH_PASSWORD === undefined){
	debug(`Basic auth requirements not met. Exiting.`);
	process.exit();
}

module.exports = function(req, res, next){

	const creds = basicAuth(req);

	if (!creds || creds.name !== process.env.BASIC_AUTH_USERNAME || creds.pass !== process.env.BASIC_AUTH_PASSWORD) {
		res.status(401);
		res.setHeader('WWW-Authenticate', 'Basic realm="Herodotus Keys Service"');
		res.end('Access denied');
		return false
	} else {
		next();
	}

}