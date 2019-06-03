const Datasources = {
	fs: require('./fs/index.js')
	}
module.exports = function Datasource(def){
	const type = def.type
	if(!Datasources[type]){throw `Datasource type '${type}' not recognized`}
	const datasource = Datasources[type](def)
	return datasource
	}
