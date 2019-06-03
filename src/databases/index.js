const Databases = {
	dev: require('./dev.js')
	}
module.exports = function Database(def){
	const type = def.type
	if(!Databases[type]){throw `Databases type '${type}' not recognized`}
	const database = Databases[type](def)
	return database
	}
