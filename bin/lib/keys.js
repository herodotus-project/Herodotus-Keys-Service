const uuid = require('uuid').v4;

const database = require('./database');

function createKey(name, description){

	if( ( name === undefined || name === null ) || ( description === undefined || description === null ) ){
		throw `Requirements for parameters not met. 'name' is ${name} and 'description' is ${description}`;
	}

	const keyEntry = {
		key : uuid().replace(/-/g, ""),
		name,
		description
	};

	return database.write(keyEntry, process.env.HERODOTUS_KEYS_TABLE)
		.then(result => {
			return keyEntry.key;
		})
		.catch(err => {
			debug('An error occured storing the key', err);
			throw err;
		})
	;


}

function checkKey(key){

}

function destroyKey(key){

}

module.exports = {
	create : createKey,
	check : checkKey,
	destroy : destroyKey
};