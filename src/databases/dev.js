var counter = 0
module.exports = function Dev(def){
	if(++counter > 3){console.warn("This class is designed to be used as a singleton. It has not been designed for many instantiations. Memory leaks may be present.")}
	const data = {}
	const stamp = 0
	return {
		sync,
		commit,
		getSchema,
		search
		}

	/*	sync - Accepts a datasource, and syncs the contents of that datasource into a database
			Also sets up ongoing sync of further updates via the onData method that should be exposed by the datasource
		*/
	async function sync(datasource){
		const dataset = datasource.updatesSince(stamp)
		const commitPromise = commit(dataset)
		var latestAsync = commitPromise
		datasource.onData( async nextDataset => commit(nextDataset) ) //TODO: cleanup & prevent leaks
		await commitPromise
		}
	async function commit(dataset){

		}
	async function search(needle){

		}
	async function getSchema(){
		const schemaClasses = /^_(class|attribute)/
		const schemaEntries = Object.entries(data)
			.filter(([k,v])=>k.match(schemaClasses))
		return Object.fromEntries(schemaEntries)
		}
	}
