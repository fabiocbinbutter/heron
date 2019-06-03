const chkdir = require('chokidar')
const {parse} = require('../../parser')

module.exports = function Fs(def){
	const watch = watcher = chokidar.watch(def.path, {
		  ignored: /(^|[\/\\])\../,
		  recurse: true,
		  persistent: true,
		  followSymlinks: false
		})
	return {
		updatesSince,
		//streamUpdatesSince
		onData
		}

	/*	sync - Accepts a datasource, and syncs the contents of that datasource into a database
			Also sets up ongoing sync of further updates via the onData method that should be exposed by the datasource
		*/
	async function updatesSince(stamp){
		const dataset = {}
		const updateStream = streamUpdatesSince(stamp)
		updateStream.on("data", d=> {dataset = {...dataset, ...d}})
		await streamEnd(updateStream)
		return dataset
		}
	function streamUpdatesSince(stamp){

		}
	function onData(handler){
		watch.on('add',processFile)
		watch.on('change',processFile)
		function processFile(path,stats){
			dataset = path,stat
			handler(dataset)
			}
		}
	}

function streamEnd(stream){ return new Promise(res => stream.on('end',res))}
