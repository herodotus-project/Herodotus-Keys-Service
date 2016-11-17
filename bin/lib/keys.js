const debug = require('debug')('bin:lib:keys');
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

	debug(`Creating key...`);

	return database.write(keyEntry, process.env.HERODOTUS_KEYS_TABLE)
		.then(result => {
			debug(`Key was successfully created and stored`);
			return keyEntry.key;
		})
		.catch(err => {
			debug('An error occured storing the key', err);
			throw err;
		})
	;


}

function checkKey(key){

	if(!key){
		throw `A key was not passed to the function`;
	}

	debug(`Checking key...`);

	return database.read({key : key},  process.env.HERODOTUS_KEYS_TABLE)
		.then(data => {
			if(data.Item !== undefined){

				if(data.Item.revoked === undefined || data.Item.revoked === false){
					return true;
				} else {
					// Key is revoked
					return false;
				}

			} else {
				throw "Key not found";
			}
		})
	;

}

function destroyKey(key){

	if(!key){
		throw `A key was not passed to the function`;
	}

	debug(`Destroying key...`);

	return database.read({key : key}, process.env.HERODOTUS_KEYS_TABLE)
		.then(data => {
			debug(data);
			if(data.Item !== undefined){

				const item = data.Item;
				item.revoked = true;

				debug(`Key was successfully destroyed`);

				return database.write(item, process.env.HERODOTUS_KEYS_TABLE);

			} else {
				throw `The key passed does not exist in our database`;
			}
		})
	;

}

module.exports = {
	create : createKey,
	check : checkKey,
	destroy : destroyKey
};